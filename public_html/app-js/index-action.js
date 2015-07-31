/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var indexapp = angular.module('indexapp', []);

indexapp.controller('indexControl', function ($scope, $http, $location) {
    console.log("indexControl");
    var fixw = localStorage["fixWord"];
    var userVocap = localStorage["userVocap"];
    $scope.fixWord = JSON.parse((fixw === undefined) ? "[]" : fixw);
    $scope.showInput = true;
    var __tempData = {};
    $scope.lines = [];
    $scope.errorVocap = [];
    $scope.ajaxCount = 0;
    $scope.isHasDraff = (localStorage["daffData"] === undefined || localStorage["daffData"] === "") ? false : true;

    var _loadid = getParam("loadid");
    console.log("loadid=", _loadid);


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
        if (!confirm("ยืนยันการบันทึก ?"))
            return;

        var _isLoaded = ($scope.currentDraff === undefined) ? false : true;

        if (!_isLoaded) {
            var _input = prompt("ใส่ ชื่อหัวข้อ หรือ Title ", "");
            if (_input === null || _input === "") {
                alert("ไม่ได้บันทึกไม่มี ชื่อ");
                return;
            }

            var saveHistory = localStorage["saveHistory"];
            if (saveHistory === undefined)
                saveHistory = JSON.stringify([]);

            saveHistory = JSON.parse(saveHistory);
            _daffData = $scope.lines;
            saveHistory.push({
                _id: new Date().getTime(),
                title: _input,
                daffData: _daffData,
                savedate: new Date()
            });

        }else{
            var saveHistory = localStorage["saveHistory"];
            if (saveHistory === undefined)
                saveHistory = JSON.stringify([]);

            saveHistory = JSON.parse(saveHistory);
            saveHistory[$scope.currentDraff["index"]] = $scope.currentDraff;
            
            console.log("save", "currentDraff");
        }
        localStorage["saveHistory"] = JSON.stringify(saveHistory);

        console.log("save", "save history");
    };

    $scope.loadDraff = function (_id) {
        var data = localStorage["saveHistory"];
        _rawData = JSON.parse(data);

        for (var _i in _rawData) {
            if (_rawData[_i]["_id"] == _id) {
                $scope.lines = _rawData[_i]["daffData"];
                $scope.currentDraff = _rawData[_i];
                $scope.currentDraff["index"] = _i;
                break;
            }
        }

        delete _rawData;
        $scope.showInput = false;
    };

    function saveErrorVocap() {
        localStorage["errorVocap"] = JSON.stringify($scope.errorVocap);
    }


    function getParam(_name) {
        if (location.search === "")
            return "";

        var ps = location.search.substr(1).split("&");
        for (var _i in ps) {
            var _p = ps[_i].split("=");
            if (_p[0] === _name)
                return _p[1];
        }

        return "";
    }

    $scope.gotoLoad = function (_id) {
        window.location = "index.html?loadid=" + encodeURIComponent(_id);
    };


    // constructure
    if (_loadid !== "") {
        $scope.loadDraff(_loadid);
    } else {
        var data = localStorage["saveHistory"];
        var _rawData = JSON.parse((data === undefined) ? "[]" : data);
        $scope.saveHistory = _rawData.slice(0, 3);
        delete _rawData;
    }
});


