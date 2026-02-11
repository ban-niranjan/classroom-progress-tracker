import React from 'react';
import './StudentList.css';

function StudentList({ studentProgress, onSelectStudent, selectedStudent }) {
  return (
    <div className="student-list-container">
      <h3>Student Progress Details</h3>
      <div className="student-list">
        {studentProgress && studentProgress.length > 0 ? (
          studentProgress.map(student => (
            <div 
              key={student.studentId} 
              className={`student-item ${selectedStudent?.studentId === student.studentId ? 'selected' : ''}`}
              onClick={() => onSelectStudent(student)}
            >
              <div className="student-info">
                <h4>{student.studentName}</h4>
                <p>{student.studentEmail}</p>
              </div>
              <div className="student-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${student.percentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {student.completedCheckpoints}/{student.totalCheckpoints} ({student.percentage}%)
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-students">No students enrolled yet</p>
        )}
      </div>
    </div>
  );
}

export default StudentList;