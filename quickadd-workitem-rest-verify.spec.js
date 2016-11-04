/**
 * POC test for automated UI tests for ALMighty
 *  Story: Display and Update Work Item Details
 *  https://github.com/almighty/almighty-core/issues/296
 *
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly.
 *
 * @author 
 */

var WorkItemListPage = require('./work-item-list.page'),
  testSupport = require('./testSupport'), 
  js = require('shelljs/global'),
  XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

describe('Work item list', function () {
  var page;
  var testTitle = "Test create workitem";

  beforeEach(function () {

  /* Create a new work item through the REST API - the workitem will
   * be manipulated in the UI - the http://localhost:8080/api/login/generate
   * endpoint is supported if the core server is run in dev mode */

  /* First, obtain a token from the core server */
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:8080/api/login/generate", true);
  request.send(null);
  request.onreadystatechange = function() {
    if (request.readyState == 4  && request.status == 200) {
      //console.log("Response to get token" + request.responseText);
         
    /* And, second, use that token to create a new work item with the core server REST API */
      var tokenStart = request.responseText.indexOf('"token":"', 0);
      var tokenEnd = request.responseText.indexOf('"},{"token"', tokenStart);
      var tokenStr = request.responseText.substring(tokenStart + 9, tokenEnd);

      var http = new XMLHttpRequest();
      var postdata= '{\"type\":\"system.bug\", \"fields\": {  \"system.title\":\"' + testTitle + '\", \"system.owner\":\"person1\", \"system.state\":\"open\", \"system.creator\":\"person2\" }}';
      http.open("POST", "http://localhost:8080/api/workitems", false);
      http.setRequestHeader("Authorization", "Bearer " + tokenStr);  
      http.setRequestHeader("Content-Type", "application/json");
      http.setRequestHeader("Accept", "application/json"); 
      http.send(postdata);
      http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 201) {
          console.log(http.responseText);
        }
      }
    }
  };

  testSupport.setBrowserMode('phone');
  page = new WorkItemListPage();
  });

  it('Find a work item created in the REST API - phone.', function () {
    expect(page.workItemTitle(page.firstWorkItem)).toBe(testTitle);
  });

});
