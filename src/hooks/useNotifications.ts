import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, NotificationSettings } from '../types';

interface NotificationHookOptions {
  inventory: InventoryItem[];
  settings: NotificationSettings;
}

interface Notification {
  id: string;
  type: 'expiration' | 'lowStock' | 'system' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  itemId?: string;
}

export function useNotifications({ inventory, settings }: NotificationHookOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  }, []);

  // Check for expiring items
  const checkExpirations = useCallback(() => {
    if (!settings.enableNotifications || !settings.expirationAlerts) {
      return;
    }

    const today = new Date();
    const newNotifications: Notification[] = [];

    inventory.forEach(item => {
      if (!item.expirationDate) return;

      const expDate = new Date(item.expirationDate);
      const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      settings.expirationDays.forEach(alertDays => {
        if (daysUntilExpiry === alertDays) {
          const notification: Notification = {
            id: `exp-${item.id}-${alertDays}`,
            type: 'expiration',
            title: 'Item Expiring Soon',
            message: `${item.name} expires in ${alertDays} days`,
            timestamp: new Date(),
            read: false,
            priority: alertDays <= 7 ? 'high' : alertDays <= 30 ? 'medium' : 'low',
            itemId: item.id,
          };
          newNotifications.push(notification);
        }
      });

      // Check for expired items
      if (daysUntilExpiry < 0) {
        const notification: Notification = {
          id: `expired-${item.id}`,
          type: 'expiration',
          title: 'Item Expired',
          message: `${item.name} expired ${Math.abs(daysUntilExpiry)} days ago`,
          timestamp: new Date(),
          read: false,
          priority: 'critical',
          itemId: item.id,
        };
        newNotifications.push(notification);
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
      
      // Show browser notifications if enabled
      if (settings.pushNotifications && permission === 'granted') {
        newNotifications.forEach(notification => {
          if (notification.priority === 'high' || notification.priority === 'critical') {
            showBrowserNotification(notification);
          }
        });
      }
    }
  }, [inventory, settings, permission]);

  // Show browser notification
  const showBrowserNotification = useCallback((notification: Notification) => {
    if ('Notification' in window && permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'critical',
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        markAsRead(notification.id);
      };

      // Auto-close after 5 seconds for non-critical notifications
      if (notification.priority !== 'critical') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    }
  }, [permission]);

  // Check if in quiet hours
  const isQuietHours = useCallback(() => {
    if (!settings.enableQuietHours) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.quietStart.split(':').map(Number);
    const [endHour, endMin] = settings.quietEnd.split(':').map(Number);
    
    const quietStart = startHour * 60 + startMin;
    const quietEnd = endHour * 60 + endMin;

    if (quietStart < quietEnd) {
      return currentTime >= quietStart && currentTime <= quietEnd;
    } else {
      // Quiet hours span midnight
      return currentTime >= quietStart || currentTime <= quietEnd;
    }
  }, [settings.enableQuietHours, settings.quietStart, settings.quietEnd]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (settings.soundAlerts && !isQuietHours()) {
      // Create a simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }
  }, [settings.soundAlerts, isQuietHours]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Clear notification
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Initialize notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Check for expiring items periodically
  useEffect(() => {
    checkExpirations();
    
    // Check every hour
    const interval = setInterval(checkExpirations, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkExpirations]);

  // Play sound for new notifications
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      const latestNotification = unreadNotifications[unreadNotifications.length - 1];
      if (latestNotification.priority === 'high' || latestNotification.priority === 'critical') {
        playNotificationSound();
      }
    }
  }, [notifications, playNotificationSound]);

  return {
    notifications,
    permission,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getUnreadCount,
    getNotificationsByType,
    isQuietHours: isQuietHours(),
  };
}