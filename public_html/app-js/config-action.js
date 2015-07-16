/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var configapp = angular.module('configapp', []);

configapp.controller('configControl', function ($scope,$location) {
    console.log("configControl");
    
    var fixw = localStorage["fixWord"];
    if(fixw === undefined){
       fixw =  localStorage["fixWord"] = JSON.stringify([]);
    }
    
    $scope.fixWord = JSON.parse(fixw);
    
    $scope.add = function (){
        if($scope.txtAdd == "" || $scope.txtAdd === undefined ) return;
        
        $scope.fixWord.push($scope.txtAdd);
        
        localStorage["fixWord"] = JSON.stringify($scope.fixWord);
        
        $scope.txtAdd = "";
        
    };
    
    $scope.del = function (_i){
        
        console.log(_i);
         $scope.fixWord.splice(_i,1);
         localStorage["fixWord"] = JSON.stringify($scope.fixWord);
        
    };
    
    
});