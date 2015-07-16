/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var indexapp = angular.module('indexapp', []);

indexapp.controller('indexControl', function ($scope, $http) {
    console.log("indexControl");
    var fixw = localStorage["fixWord"];
    var userVocap = localStorage["userVocap"];
    $scope.fixWord = JSON.parse(fixw);
    $scope.showInput = true;
    var __tempData = {};
    $scope.lines = [];
    $scope.errorVocap = [];
    $scope.ajaxCount = 0;
    $scope.isHasDraff = (localStorage["daffData"] === undefined || localStorage["daffData"] === "" )? false : true;


    if (fixw === undefined) {
        fixw = localStorage["fixWord"] = JSON.stringify([]);
    }
    if (userVocap !== undefined) {
        $scope.userVocap = JSON.parse(userVocap);
    } else {
        $scope.userVocap = [];
    }

    $scope.translate = function () {
        $scope.showInput = false;

        console.log($scope.textareaData);
        var txt = $scope.textareaData;
        if (txt === undefined)
            return;
        var spText = txt.split("\n");

        $scope.lines = [];
        for (var _i in spText) {

            var line = spText[_i];
            wordProcess(line);
        }


    };

    function wordProcess(line) {
        var word = line.split(" ");
        if (word.length > 2) {
            if (word[1].indexOf(":") > 0) {
                console.log("find people", word[0], word[1]);
                word[0] = word[0] + " " + word[1];
                word.splice(1, 1);
            }
        }
        $scope.lines.push({words: word, translate: []});
//        console.log(word);
    }

    $scope.sendTranslate = function (_mi, _i, _v) {
        console.log(_mi, _i, _v);

        var _HOST = "http://dict.longdo.com//mobile.php?search=";
        var _DATA = _v.replace(".", "").replace("\"", "").replace(",", "").replace("?", "");

//find in temp
        if (__tempData[_DATA] !== undefined) {
            var res = __tempData[_DATA];
            console.log("1. cache data : ", _DATA, res);
            return;
        }

//find in user Vocap
        var userVocaps = $scope.userVocap;
        for (var _ii in userVocaps) {
            if (_DATA === userVocaps[_ii].vocap) {
                var res = userVocaps[_ii].res;
                console.log("2. UserVocap : ", _DATA, res);
                $scope.lines[_mi]["translate"][_i] = "(" + res + ")";
                return;
            }
        }


//find online
        var req = {
            method: 'GET',
            url: _HOST + _DATA
        };

        $scope.lines[_mi]["translate"][_i] = "(" + "load..." + ")";
        //ajax count
        ++$scope.ajaxCount;

        $http(req).success(function (data, status, headers, config) {

            var res = htmlPull(data, _DATA);
            $scope.lines[_mi]["translate"][_i] = "(" + res + ")";
            console.log("3. online : ", _DATA, res);
            __tempData[_DATA] = res;

        }).error(function (data, status, headers, config) {
            alert("error connection" + status);
            $scope.lines[_mi]["translate"][_i] = "(" + "Error..." + ")";
        });
    };

    $scope.checkFixWord = function (_word) {
        for (var i = 0; i < $scope.fixWord.length; i++) {

            if (_word.indexOf($scope.fixWord[i]) !== -1) {
                return true;
            }
        }

        return false;
    };
    $scope.doagain = function () {
        $scope.showInput = true;
        $scope.textareaData = "";
    };

    function htmlPull(_html, _DATA) {
        var key = "NECTEC Lexitron Dictionary EN-TH";
        var _s = _html.indexOf(key);
        var _e = _html.indexOf("</tr>", _s);
        var res = _html.substring(_s, _e);
        //2
        _s = res.indexOf("</A>");
        _e = res.indexOf("</b>", _s);
        res = res.substring(_s + 12, (_e === -1) ? res.length : _e);

        // junk word
        var jword = ["<b>See also:", "<b>Syn.", "</td>", "<b>Ant.", ">"];
        for (var _i in jword) {
            res = res.replace(jword[_i], "");
        }

//        error data
        if (res.length > 50) {
            console.log(res);
            res = "Err..";
        }

//        save error
        if (res === "Err.." || res.trim() === "") {
            $scope.errorVocap.push({
                vocap: _DATA,
                'res': res
            });

            saveErrorVocap();
        }

        return res;
    }


    $scope.draff = function () {
        if(!confirm("ยืนยันการบันทึก ?")) return ;
        
        localStorage["daffData"] = JSON.stringify($scope.lines);
        
        console.log("save");
    };

    $scope.loadDraff = function () {
        var data = localStorage["daffData"];
        $scope.lines = JSON.parse(data);
        $scope.showInput = false;
    };

    function saveErrorVocap() {
        localStorage["errorVocap"] = JSON.stringify($scope.errorVocap);
    }

});


