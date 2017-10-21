/**
 * Created by admin on 10/21/17.
 */
var semester = {};
var topoSort = require('topoSort');

semester.schedule = function (courseList, curSem) {
    courseList = topoSort.tsort(courseList);
    var avg = Math.ceil(courseList.length / (8 - curSem));
    var chosen = [];
    var result = {};
    for (var i = curSem; i < 8; i++) {
        result[i] = [];
        if (chosen.length < courseList.length) {
            var semToChoose = ["All"];
            if (i % 2 == 0) {
                semToChoose.push("Fall");
            } else {
                semToChoose.push("Spring");
            }
            for (var numChosen = 0; numChosen < avg; numChosen++) {
                courseList.forEach(function (course) {
                    if (chosen.indexOf(course.name) === -1 && semToChoose.indexOf(course.available) !== -1) {
                        var flag = false;
                        if (course.prereq) {
                            course.prereq.forEach(function (dependent) {
                                if (chosen.indexOf(dependent) === -1) {
                                    flag = true;
                                }
                            });
                        }
                        if (!flag) {
                            result[i].push(course);
                            chosen.push(course);
                        }
                    }
                });
            }
        }
    }
    if (chosen.length == courseList.length) {
        return result;
    } else {
        return undefined;
    }
};

module.exports = semester;