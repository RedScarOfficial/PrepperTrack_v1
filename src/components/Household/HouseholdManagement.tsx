import React, { useState } from 'react';
import { Users, Plus, UserPlus, Filter, Search, Grid, List } from 'lucide-react';
import { usePrepper } from '../../context/PrepperContext';
import MemberCard from './MemberCard';
import GroupCard from './GroupCard';
import AddMemberModal from './AddMemberModal';
import AddGroupModal from './AddGroupModal';
import HouseholdStats from './HouseholdStats';

export default function HouseholdManagement() {
  const { state } = usePrepper();
  const { household, householdGroups } = state;
  
  const [activeTab, setActiveTab] = useState<'members' | 'groups'>('members');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);

  const filteredMembers = household.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         member.responsibilities?.some(resp => resp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGroup = selectedGroup === 'all' || member.groupId === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const ungroupedMembers = household.filter(member => !member.groupId);
  const totalCalories = household.reduce((sum, member) => sum + member.dailyCalories, 0);
  const totalWater = household.reduce((sum, member) => sum + member.dailyWaterLiters, 0);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Household Management</h1>
            <p className="text-slate-600">Manage family members, groups, and organizational structure</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddGroup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Add Group</span>
            </button>
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Household Statistics */}
        <HouseholdStats 
          members={household}
          groups={householdGroups}
          totalCalories={totalCalories}
          totalWater={totalWater}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'members'
                  ? 'bg-green-100 text-green-700'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              Members ({household.length})
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'bg-green-100 text-green-700'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              Groups ({householdGroups.length})
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="">Ungrouped</option>
              {householdGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>

            <div className="flex items-center text-sm text-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredMembers.length} of {household.length} members
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'members' ? (
        <div className="space-y-6">
          {/* Grouped Members */}
          {householdGroups.map(group => {
            const groupMembers = household.filter(member => member.groupId === group.id);
            if (groupMembers.length === 0) return null;

            return (
              <div key={group.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-${group.color}-500`}></div>
                    <h2 className="text-xl font-semibold text-slate-800">{group.name}</h2>
                    <span className="text-sm text-slate-500">({groupMembers.length} members)</span>
                  </div>
                </div>
                
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {groupMembers
                    .filter(member => {
                      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                           member.responsibilities?.some(resp => resp.toLowerCase().includes(searchTerm.toLowerCase()));
                      return matchesSearch;
                    })
                    .map(member => (
                      <MemberCard 
                        key={member.id} 
                        member={member} 
                        group={group}
                        viewMode={viewMode}
                      />
                    ))}
                </div>
              </div>
            );
          })}

          {/* Ungrouped Members */}
          {ungroupedMembers.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Ungrouped Members</h2>
                <span className="text-sm text-slate-500">({ungroupedMembers.length} members)</span>
              </div>
              
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {ungroupedMembers
                  .filter(member => {
                    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                         member.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                         member.responsibilities?.some(resp => resp.toLowerCase().includes(searchTerm.toLowerCase()));
                    return matchesSearch;
                  })
                  .map(member => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      viewMode={viewMode}
                    />
                  ))}
              </div>
            </div>
          )}

          {filteredMembers.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No members found</p>
              <p className="text-sm text-slate-500">
                {searchTerm || selectedGroup !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first household member to get started'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {householdGroups.map(group => (
              <GroupCard 
                key={group.id} 
                group={group} 
                members={household.filter(member => member.groupId === group.id)}
                viewMode={viewMode}
              />
            ))}
          </div>

          {householdGroups.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No groups created</p>
              <p className="text-sm text-slate-500">Create groups to organize your household members</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSave={() => setShowAddMember(false)}
        />
      )}

      {showAddGroup && (
        <AddGroupModal
          onClose={() => setShowAddGroup(false)}
          onSave={() => setShowAddGroup(false)}
        />
      )}
    </div>
  );
}