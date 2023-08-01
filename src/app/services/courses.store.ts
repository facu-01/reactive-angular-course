import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import {
  catchError,
  map,
  shareReplay,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course } from "../model/course";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  courses$: Observable<Course[]>;

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messages: MessagesService
  ) {
    const request$ = this.http.get<{ payload: Course[] }>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((err) => {
        const message = "Ocurrío un error al cargar los cursos";
        this.messages.showErrors(message);

        console.log(err);
        return throwError(err);
      }),
      shareReplay()
    );

    this.courses$ = this.loading.showLoaderUntilCompleted(request$);
  }

  saveCourse(courseId: string, changes: Partial<Course>) {
    this.courses$ = of({
      id: courseId,
      changes,
    }).pipe(
      withLatestFrom(this.courses$),
      map(([{ id, changes }, courses]) => {
        return courses.map((c) => {
          if (c.id !== id) return c;

          return { c, ...changes } as Course;
        });
      }),
      tap(console.log)
    );
  }
}
