package com.SINJA.repository;

import com.SINJA.model.Student;

public interface StudentsRepository {
    Student save(Student student);
    void delete(Long id);
    Student findById(Long id);
}
