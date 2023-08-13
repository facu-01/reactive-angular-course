import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  courseData$: Observable<{
    course: Course;
    lessons: Lesson[];
  }>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    this.courseData$ = combineLatest([
      this.coursesService.getCourseById(courseId).pipe(startWith(null)),
      this.coursesService.getLessonsByCourseId(courseId).pipe(startWith([])),
    ]).pipe(map(([course, lessons]) => ({ course, lessons })));
  }
}
