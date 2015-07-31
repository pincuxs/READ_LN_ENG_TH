/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var saveHis = angular.module('saveHis', []);

saveHis.controller('saveHisControl', function ($scope, $location) {

    var saveHistory = localStorage["saveHistory"];
    if (saveHistory === undefined)
        saveHistory = JSON.stringify([]);

    $scope.saveHistory = JSON.parse(saveHistory);

    $scope.gotoLoadHistory = function (_id){
        console.log("gotoLoadHistory",_id);
        
        window.location = "index.html?loadid=" + encodeURIComponent(_id);
    };


    $scope.del = function (_i){
        if(!confirm("ยืนยัน ?")) return ;
        
         console.log(_i);
         $scope.saveHistory.splice(_i,1);
         localStorage["saveHistory"] = JSON.stringify($scope.saveHistory);
        
    };
    
});

