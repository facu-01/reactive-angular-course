import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  http = inject(HttpClient);

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLesson(filter: string): Observable<Lesson[]> {
    return this.http
      .get<{ payload: Lesson[] }>("api/lessons", {
        params: {
          filter,
          pageSize: 100,
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }
}
