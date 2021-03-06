define('plugin/prnfb/pr-triggerbutton', [
 'jquery',
 'aui',
 'bitbucket/util/state'
], function($, AJS, pageState) {

 var buttonsAdminUrl = AJS.contextPath() + "/rest/prnfb-admin/1.0/settings/buttons"; 

 var waiting = '<span class="aui-icon aui-icon-wait aui-icon-small">Wait</span>';

 var $buttonArea = $(".triggerManualNotification").closest('ul');
 $(".triggerManualNotification").remove();

 function loadSettingsAndShowButtons() {
  var hasButtons = false;
  $.get(buttonsAdminUrl + '/repository/' + pageState.getRepository().id + '/pullrequest/' + pageState.getPullRequest().id, function(settings) {
   settings.forEach(function(item) {
    hasButtons = true;

    var $buttonDropdownItem = $('<li><button class="aui-button aui-button-link" role="menuitem">' + item.name + '</button></li>');
    $buttonDropdownItem.find("button").click(function() {
     var $this = $(this);
     $this.attr("disabled", "disabled");
     $this.attr("aria-disabled", "true");
     $this.prepend(waiting);

     $.post(buttonsAdminUrl + '/' + item.uuid + '/press/repository/' + pageState.getRepository().id + '/pullrequest/' + pageState.getPullRequest().id, function() {
      setTimeout(function() {
       $this.removeAttr("disabled");
       $this.removeAttr("aria-disabled");
       $this.find("span").remove();
      }, 500);
     });
    });

    $buttonArea.append($buttonDropdownItem);
   });

   if (hasButtons) {
    $buttonDropdownParent.show();
   }
  });
 }

 loadSettingsAndShowButtons();

 //If a reviewer approves the PR, then a button may become visible
 $('.aui-button.approve').click(function() {
  setTimeout(function() {
   $buttonDropdownParent.hide();
   loadSettingsAndShowButtons();
  }, 1000);
 });
});

AJS.$(document).ready(function() {
 require('plugin/prnfb/pr-triggerbutton');
});
