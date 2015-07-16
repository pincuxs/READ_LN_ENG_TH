/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var indexapp = angular.module('indexapp', []);

indexapp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

indexapp.controller('indexControl', function ($scope, $http) {
    console.log("indexControl");
    var fixw = localStorage["fixWord"];
    if (fixw === undefined) {
        fixw = localStorage["fixWord"] = JSON.stringify([]);
    }
    $scope.fixWord = JSON.parse(fixw);
    $scope.showInput = true;
    var __tempData = {};



    $scope.translate = function () {
        console.log($scope.textareaData);
        var txt = $scope.textareaData;
        if (txt === undefined)
            return;
        var spText = txt.split("\n");
        var length = spText.length;
        console.log(length);
        $scope.lines = [];
        for (var _i in spText) {

            var line = spText[_i];
            wordProcess(line);
        }

        $scope.showInput = false;
    };
    function wordProcess(line) {
        var word = line.split(" ");
        $scope.lines.push({words: word , translate : []});
        console.log(word);
    }

    $scope.sendTranslate = function (_mi, _i, _v) {
        console.log(_mi, _i, _v);

        var _HOST = "http://dict.longdo.com//mobile.php?search=";
        var _DATA = _v.replace(".", "").replace("\"", "").replace(",", "").replace("?", "");

        if (__tempData[_DATA] !== undefined) {
            var res = __tempData[_DATA];
//            $scope.lines[_mi]["translate"][_i] = "(" + res + ")";
            console.log(_v, "cache data");
            return;
        }

        var req = {
            method: 'GET',
            url: _HOST + _DATA
        };
        $http(req).success(function (data, status, headers, config) {
            var res = htmlPull(data, _DATA);

            console.log(res, status);
            $scope.lines[_mi]["translate"][_i] = "(" + res + ")";
            __tempData[_DATA] = res;

        }).error(function (data, status, headers, config) {
            alert("error" + status);
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

    function htmlPull(_html, _word) {
//        var regex = new RegExp('\\b' + _word + '\\b');
        var key = "NECTEC Lexitron Dictionary EN-TH";
        var _s = _html.indexOf(key);
        var _e = _html.indexOf("</tr>", _s);
        var res = _html.substring(_s, _e);
//        console.log(_s, _e, res);

        //2
        _s = res.indexOf("</A>");
        _e = res.indexOf("</b>", _s);
        res = res.substring(_s + 12, (_e === -1) ? res.length : _e);
//        console.log(_s, _e, res);

        // junk word
        var jword = ["<b>See also:", "<b>Syn.", "</td>", "<b>Ant.", ">"];
        for (var _i in jword) {
            res = res.replace(jword[_i], "");
        }

//        console.log(res);
        return res;
    }
});


