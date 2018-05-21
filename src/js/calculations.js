var grade_converter = [["A*", 8],["A", 7],["B", 6],["C", 5],["D", 4],["E", 3],[9,9],[8,8],[7,7],[6,6],[5,5],[4,4],[3,3],[2,2],[1,1]];

function getStudentsWithAvgBaselines(baselines) {
    var students = [];
    /* Remove duplicates first */
    for (var i = 0; i < baselines.length; i++) {
        row = baselines[i];
        var new_student = true;
        for (var j = 0; j < students.length; j++) {
            if (students[j]["ID"] === row["ID"]) {
                var cur_baseline = students[j]["Baseline"];
                var count = students[j]["Count"];
                var baseline = parseFloat(row["Baseline"]);
                if (isNaN(baseline)) break;
                students[j]["Baseline"] = ((count * cur_baseline) + baseline) / (count + 1);
                students[j]["Count"] = count + 1;
                new_student = false;
                break;
            }
        }
        if (new_student) {
            baseline = parseFloat(row["Baseline"]);
            if (isNaN(baseline)) continue;
            students.push({
                "ID": row["ID"],
                "Name": row["Name"],
                "Surname": row["Surname"],
                "Baseline": row["Baseline"],
                "Count": 1
            });
        }
    }
    return students;
}

function getStudentAvgForCycle(reports, student, cycle, baselines) {
    var avg_grade = 0;
    var avg_va = 0;
    var count = 0;
    for (var i = 0; i < reports.length; i++) {
        if (parseInt(reports[i]["Student"]) === parseInt(student) && parseInt(reports[i]["Cycle"]) === parseInt(cycle)) {
            var grade = parseInt(convertGradeToValue(reports[i]["Grade"],"GCSE"));
            var baseline = getBaselineForStudentAndSubject(student, reports[i]["Subject"], baselines);
            if (!baseline || isNaN(grade)) continue;
            var va = grade - baseline;
            avg_grade = ((avg_grade * count) + grade) / (count + 1);
            avg_va = ((avg_va * count) + va) / (count + 1);
            count++;
        }
    }
    return count > 0 ? [avg_grade, avg_va] : ["-","-"];
}

function getBaselineForStudentAndSubject(student, subject, baselines) {
    for (var i = 0; i < baselines.length; i++) {
        if (parseInt(baselines[i]["ID"]) === parseInt(student) && baselines[i]["Subject"] === subject) {
            var baseline = parseFloat(baselines[i]["Baseline"]);
            return isNaN(baseline) ? false : baseline;
        }
    }
    return false;
}

function convertGradeToValue(grade, type) {
    switch(type) {
        case "GCSE":
        default:
            for (var i = 0; i < grade_converter.length; i++) {
                if (grade == grade_converter[i][0]) return grade_converter[i][1];
            }
            return "-";
            break;
        case "A Level":
            break;
    }
}
