import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, scan, shareReplay, switchMap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course } from "../model/course";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private changesSubject = new BehaviorSubject<{
    id: string;
    changes: Partial<Course>;
  }>({ id: null, changes: null });

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

    const loadingCourses$ = this.loading.showLoaderUntilCompleted(request$);

    this.courses$ = loadingCourses$.pipe(
      switchMap((courses) =>
        this.changesSubject.pipe(
          scan((acc, { id, changes }) => {
            if (id === null) return acc;

            return acc.map((c) => {
              if (c.id !== id) return c;
              return { ...c, ...changes };
            });
          }, courses)
        )
      )
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>) {
    this.changesSubject.next({ id: courseId, changes });

    //TODO: handle errors

    this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay())
      .subscribe();
  }
}
