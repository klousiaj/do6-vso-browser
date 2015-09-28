'use strict';

/*global Work*/
// this class is the modified version of the data that is provided back from a query.
function WorkItemList() {
  var list = this;
  
  // a dictionary that contains an ID as the key and a WorkItem as the value 
  this.workItems = {};
  this.relationsList = {
    'System.LinkTypes.Hierarchy-Forward': 'Child',
    'System.LinkTypes.Hierarchy-Reverse': 'Parent'
  };
  
  // the list of possible types of Work Items to choose from.
  this.types = {
    selected: [],
    values: []
  };

  // the list of possible assignees to choose from.
  this.assignees = {
    selected: [],
    values: []
  };

  function WorkItem(id) {
    this.id = id;
    this.points = new Work();
    this.work = new Work();
    this.childCount = 0;
    this.fields = {};
    this.parent = 0;
    this.children = [];
    this.relations = {};
    this.assignee = 'N/A';

    this.toString = function () {
      return this.fields['System.WorkItemType'] + '-' + this.fields['System.Title'] + ' {' + this.id + '}';
    };
  }

  this.reset = function () {
    this.workItems = {};
  };
  
  // Microsoft.VSTS.Scheduling.StoryPoints
  // Microsoft.VSTS.Common.Priority: 2
  // Microsoft.VSTS.Common.StackRank: 333140973
  // Microsoft.VSTS.Common.StateChangeDate: '2015-02-16T17:46:43.243Z'
  // Microsoft.VSTS.Common.ValueArea: 'Business'
  // System.AreaPath: 'OjpApplicationMaintenance'
  // System.ChangedBy: 'Calin Duma <calin.duma@usdoj.gov>'
  // System.ChangedDate: '2015-06-10T01:33:33.85Z'
  // System.CreatedBy: 'Calin Duma <calin.duma@usdoj.gov>'
  // System.CreatedDate: '2015-02-16T17:46:43.243Z'
  // System.Description: 'As a Solicitation Streamlining TESTER I would like to have a controlled environment where I can conduct independent testing of all solicitation streamlining functionality (Forecaster, SC, GMS, grants.gov connector and grants.gov).<div><br></div><div>Note: &nbsp;it is TBD where the environments will reside, preferably in AWS but OJP physical infrastructure is also acceptable if AWS is not viable. &nbsp;Based on subsequent discussions, the TEST environment (including SharePoint) will be on Physical OJP Infrastructure.</div><div>It has been determined that for Solicitation Streamlining Phase I the TEST environment will reside on Physical OJP TEST infrastructure. &nbsp;This include the physical OJP SharePoint staging.</div>'
  // System.IterationPath: 'OjpApplicationMaintenance'
  // System.Reason: 'New'
  // System.State: 'New'
  // System.Tags: 'Solicitation Consolidation'
  // System.TeamProject: 'OjpApplicationMaintenance'
  // System.Title: 'Establish UAT and FQT environments for Solicitation Streamlining'
  // System.WorkItemType: 'Feature'
    
  // create a new work item and add it to the list of work items
  this.addWorkItem = function (item) {
    // don't do anything if the item is removed.
    if (item.fields['System.State'] !== 'Removed') {
      // if the object doesn't exist create it.
      if (Object.keys(this.workItems).indexOf(item.id.toString()) === -1) {
        list.workItems[item.id] = new WorkItem(item.id);
        // if this is a task
        if (item.fields['System.WorkItemType'] === 'Task') {
          list.workItems[item.id].work.completed = !item.fields['Microsoft.VSTS.Scheduling.CompletedWork'] ? 0 : item.fields['Microsoft.VSTS.Scheduling.CompletedWork'];
          list.workItems[item.id].work.remaining = !item.fields['Microsoft.VSTS.Scheduling.RemainingWork'] ? 0 : item.fields['Microsoft.VSTS.Scheduling.RemainingWork'];
          list.workItems[item.id].work.planned = !item.fields['Microsoft.VSTS.Scheduling.OriginalEstimate'] ? 0 : item.fields['Microsoft.VSTS.Scheduling.OriginalEstimate'];
        } else if (item.fields['System.WorkItemType'] === 'User Story') {
          list.workItems[item.id].points.planned = !item.fields['Microsoft.VSTS.Scheduling.StoryPoints'] ? 0 : item.fields['Microsoft.VSTS.Scheduling.StoryPoints'];
        }
      }
      list.workItems[item.id].fields = item.fields;
      list.workItems[item.id].relations = item.relations;
      // pull the email off the end of the user's name
      if (typeof item.fields['System.AssignedTo'] !== 'undefined') {
        var idx = item.fields['System.AssignedTo'].indexOf('<');
        if (idx > -1) {
          list.workItems[item.id].assignee = item.fields['System.AssignedTo'].substring(0, idx).trim();
        } else {
          list.workItems[item.id].assignee = item.fields['System.AssignedTo'];
        }
      }
      // put the assignee on the possible list of assignees.
      if (this.assignees.values.indexOf(list.workItems[item.id].assignee) === -1) {
        this.assignees.values.push(list.workItems[item.id].assignee);
      }
      // put the work item type on the possible list of work item types.
      if (this.types.values.indexOf(item.fields['System.WorkItemType']) === -1) {
        this.types.values.push(item.fields['System.WorkItemType']);
      }
    }
  };
  
  // work can be either points or it can be hours, it is all work
  this.addPointsToParent = function (parentId, work, isClosed) {
    // if the parent doesn't exist create it.
    // the rest of it will be added later but we need to create the placeholder first 
    // so we can keep track of points if the objects are loaded out of order.
    if (Object.keys(list.workItems).indexOf(parentId.toString()) === -1) {
      list.workItems[parentId] = new WorkItem(parentId);
    }
    // add the child count
    list.workItems[parentId].childCount++;
    
    // add the points to the parent
    list.workItems[parentId].work += work;
    if (isClosed) {
      list.workItems[parentId].closedWork += work;
    }
  };
}