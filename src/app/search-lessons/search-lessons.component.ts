import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./search-lessons.component.html",
  styleUrls: ["./search-lessons.component.css"],
})
export class SearchLessonsComponent {
  lessons$: Observable<Lesson[]>;

  activeLesson: Lesson = null;

  constructor(private coursesService: CoursesService) {}

  search(filter: string) {
    this.lessons$ = this.coursesService.searchLesson(filter);
  }

  selectLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  backToResults() {
    this.activeLesson = null;
  }
}
