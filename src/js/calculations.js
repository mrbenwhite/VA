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

function generateFullTutorArray(reports, cycles, baselines) {
    var final_array = [];
    /* Remove duplicates first */
    /* Generate students and baselines */
    for (var i = 0; i < baselines.length; i++) {
        row = baselines[i];
        var new_student = true;
        for (var j = 0; j < final_array.length; j++) {
            if (final_array[j]["ID"] === row["ID"]) {
                var cur_baseline = final_array[j]["AvBaseline"];
                var count = final_array[j]["Count"];
                var baseline = parseFloat(row["Baseline"]);
                if (isNaN(baseline)) {
                    baseline = "-";
                } else {
                    final_array[j]["AvBaseline"] = ((count * cur_baseline) + baseline) / (count + 1);
                    final_array[j]["Count"] = count + 1;
                }
                var subject = row["Subject"];
                final_array[j]["Baselines"][subject] = baseline;
                new_student = false;
                break;
            }
        }
        if (new_student) {
            var new_student = {
                "ID": row["ID"],
                "Name": row["Name"],
                "Surname": row["Surname"],
                "Cycles": []
            };
            var baseline = parseFloat(row["Baseline"]);
            var subject = row["Subject"];
            var count = 1;
            var new_baselines = {};
            if (isNaN(baseline)) {
                new_student["AvBaseline"] = 0;
                new_student["Count"] = 0;
                new_baselines[subject] = "-";
            } else {
                new_student["AvBaseline"] = baseline;
                new_student["Count"] = 1;
                new_baselines[subject] = baseline;
            }
            new_student["Baselines"] = new_baselines;
            final_array.push(new_student);
        }
    }
    /* Add in results */
    for (var i = 0; i < reports.length; i++) {
        var student_id = reports[i]["Student"];
        var cycle_id = reports[i]["Cycle"];
        var subject = reports[i]["Subject"];
        var grade = reports[i]["Grade"];
        var grade_val = convertGradeToValue(grade, "GCSE");
        for (var j = 0; j < final_array.length; j++) {
            if (final_array[j]["ID"] === student_id) {
                var student_cycles = final_array[j]["Cycles"];
                var baseline = parseFloat(final_array[j]["Baselines"][subject]);
                var new_cycle = true;
                for (var k = 0; k < student_cycles.length; k++) {
                    if (student_cycles[k]["ID"] === cycle_id) {
                        /* Add result to existing cycle */
                        var va = "";
                        if(!isNaN(baseline) && !isNaN(grade_val)) {
                            va = grade_val - baseline;
                            var avg_grade = student_cycles[k]["AvGrade"];
                            var avg_grade_count = student_cycles[k]["AvGradeCount"];
                            var avg_va = student_cycles[k]["AvVA"];
                            var avg_va_count = student_cycles[k]["AvVACount"];
                            avg_grade = ((avg_grade * avg_grade_count) + grade_val) / (avg_grade_count + 1);
                            avg_va = ((avg_va * avg_va_count) + va) / (avg_va_count + 1);
                            student_cycles[k]["AvGrade"] = avg_grade;
                            student_cycles[k]["AvGradeCount"] = avg_grade_count + 1;
                            student_cycles[k]["AvVA"] = avg_va;
                            student_cycles[k]["AvVACount"] = avg_va_count + 1;
                        }
                        student_cycles[k]["Subjects"][subject] = {"Baseline": baseline, "Grade": grade, "GradeVal": grade_val, "VA": va};
                        new_cycle = false;
                        break;
                    }
                }
                if (new_cycle) {
                    var new_cycle_array = {"ID": cycle_id};
                    var va = "";
                    if(!isNaN(baseline) && !isNaN(grade_val)) {
                        va = grade_val - baseline;
                        new_cycle_array["AvGrade"] = grade_val;
                        new_cycle_array["AvGradeCount"] = 1;
                        new_cycle_array["AvVA"] = va;
                        new_cycle_array["AvVACount"] = 1;
                    } else {
                        new_cycle_array["AvGrade"] = 0;
                        new_cycle_array["AvGradeCount"] = 0;
                        new_cycle_array["AvVA"] = 0;
                        new_cycle_array["AvVACount"] = 0;
                    }
                    new_cycle_array["Subjects"] = {};
                    new_cycle_array["Subjects"][subject] = {"Baseline": baseline, "Grade": grade, "GradeVal": grade_val, "VA": va};
                    final_array[j]["Cycles"].push(new_cycle_array);
                }
                break;
            }
        }
    }
    return final_array;
}
