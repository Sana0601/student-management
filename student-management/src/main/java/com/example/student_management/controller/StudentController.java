
        package com.example.student_management.controller;

import com.example.student_management.entity.Student;
import com.example.student_management.security.JwtService;
import com.example.student_management.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;
    private final JwtService jwtService;

    public StudentController(StudentService studentService,
                             JwtService jwtService) {
        this.studentService = studentService;
        this.jwtService = jwtService;
    }

    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<Student> registerStudent(
            @RequestBody Student student) {

        Student savedStudent =
                studentService.registerStudent(student);

        return ResponseEntity.ok(savedStudent);
    }


    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginStudent(
            @RequestBody Map<String, String> loginRequest) {

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Student student =
                studentService.loginStudent(email, password);

        String token =
                jwtService.generateToken(student.getEmail());

        Map<String, Object> response =
                new HashMap<>();

        response.put("message", "Login successful");
        response.put("token", token);

        Map<String, Object> studentData =
                new HashMap<>();

        studentData.put("id", student.getId());
        studentData.put("name", student.getName());
        studentData.put("email", student.getEmail());
        studentData.put("phone", student.getPhone());
        studentData.put("course", student.getCourse());
        studentData.put("year", student.getYear());

        response.put("student", studentData);

        return ResponseEntity.ok(response);
    }


    // ================= GET ALL STUDENTS =================

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }


    // ================= UPDATE STUDENT =================

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {

        Student updatedStudent =
                studentService.updateStudent(id, student);

        return ResponseEntity.ok(updatedStudent);
    }


    // ================= DELETE STUDENT =================

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                "Student deleted successfully"
        );

        return ResponseEntity.ok(response);
    }
}

