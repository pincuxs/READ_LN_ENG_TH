/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mycap = angular.module('mycap', []);

mycap.controller('mycapControl', function ($scope) {
    console.log("mycapControl");
    
    $scope.txtAdd = [];
    var  errorVocap = localStorage["errorVocap"];
    var  userVocap = localStorage["userVocap"];
    
    if(errorVocap !== undefined){
        $scope.errorVocap = JSON.parse(errorVocap);
    }
    if(userVocap !== undefined){
        $scope.userVocap = JSON.parse(userVocap);
    }else{
        $scope.userVocap = [];
    }
    
    
    $scope.addUserVocap = function (_i){
        if($scope.txtAdd[_i] == "" || $scope.txtAdd[_i] === undefined ) return;
        
         $scope.userVocap.push({
                vocap :  $scope.errorVocap[_i].vocap,
                'res' : $scope.txtAdd[_i]
            });
        
        $scope.txtAdd.splice(_i,1);
        localStorage["userVocap"] = JSON.stringify($scope.userVocap);
        
        $scope.delError(_i);
    };
    
    $scope.delError = function (_i){
        console.log(_i);
         $scope.errorVocap.splice(_i,1);
         localStorage["errorVocap"] = JSON.stringify($scope.errorVocap);
        
    };
    $scope.delUserVocap = function (_i){
        console.log(_i);
         $scope.userVocap.splice(_i,1);
         localStorage["userVocap"] = JSON.stringify($scope.userVocap);
        
    };
    
});