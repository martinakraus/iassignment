import { Injectable } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import {
  flatMap,
  from,
  interval,
  mergeMap,
  Observable,
  of,
  retryWhen,
  throwError,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AssignmentServiceService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  makeAssignmentData(assignmentObject, payload): Observable<any> {
    const url = `${assignmentObject.formType}/${assignmentObject.formId}/organisationUnits.json`;
    return this.httpClient.post(url, payload).pipe(
      retryWhen(() => {
        return interval(5000).pipe(
          flatMap((count) =>
            count === 3
              ? throwError(
                  "Failed to add assignment to server, please check your internet connection"
                )
              : of(count)
          )
        );
      })
    );
  }

  makeAssignmentDataForAll(assignmentObject, payload): Observable<any> {
    const url = `${assignmentObject.formType}/${assignmentObject.id}/organisationUnits.json`;
    return this.httpClient.post(url, payload).pipe(
      retryWhen(() => {
        return interval(5000).pipe(
          flatMap((count) =>
            count === 3
              ? throwError(
                  "Failed to add assignment to server, please check your internet connection"
                )
              : of(count)
          )
        );
      })
    );
  }

  assignOfflineAssignments(offlinePayload: any[]): Observable<any> {
    return from(offlinePayload).pipe(
      mergeMap((payload, index) => {
        const url = `${payload.formType}/${payload.formId}/organisationUnits.json`;
        return <Observable<any>>(
          this.httpClient.post(url, payload.assignmentPayload).pipe()
        );
      })
    );
  }

  getAnalyticsOrgunits(
    ouOpttions: string,
    selectedOrgunits: any[]
  ): Observable<any> {
    const ouString = selectedOrgunits.map((ou) => ou.id).join(";");
    const url =
      "analytics?dimension=pe:LAST_QUARTER&filter=ou:" +
      ouOpttions +
      ouString +
      "&displayProperty=NAME&skipData=true&includeMetadataDetails=true";
    return this.httpClient.get(url);
  }
}
