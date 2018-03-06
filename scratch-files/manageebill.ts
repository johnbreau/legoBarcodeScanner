import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ApplicationRef} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import * as Schemas from 'frontend-components/src/aem-components/interfaces/service-layer/schemas';
import { ISelectizeOptions } from 'frontend-components/src/sprint-angular-modules/directives/selectize/selectize.interface';
import { ISprintApp } from 'frontend-components/src/aem-components/interfaces/aem-bridge/sprint-app.interface';
import { IAnalyticsItem } from 'frontend-components/src/aem-components/interfaces/shared/analytics.interface';
import { ManageEbillService } from 'src/account/manage-ebill/manage-ebill.service';
import { UserService } from 'src/shared/service-layer-integration/user.service';
import { SubscriptionsService } from 'src/shared/service-layer-integration/subscriptions.service';
import { CareFormValidators } from 'src/shared/forms/validators/care.validators';
import { ManageEbillModalComponent } from 'src/account/manage-ebill/manage-ebill-modal/manage-ebill-modal.component';
import { TranslateService } from 'ng2-translate';
import { ManageEbillCancelModalComponent } from 'src/account/manage-ebill/manage-ebill-cancel-modal/manage-ebill-cancel-modal.component';

declare const sprintApp: ISprintApp;

@Component({
  selector: 'sprint-care-view-agreement',
  templateUrl: './manage-ebill.component.html',
  providers: [
    ManageEbillService
  ]
})
export class ManageEbillComponent implements OnInit, OnDestroy {
  @ViewChild(ManageEbillModalComponent)
  private billDeliveryModal: ManageEbillModalComponent;
  @ViewChild(ManageEbillCancelModalComponent)
  private manageEbillCancelModal: ManageEbillCancelModalComponent;
  private observableSubscriptions: Subscription[] = [];
  private changesMadeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private singlePTNSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private emailEditingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private selectedBillingMethodSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private selectedLanguageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private selectedPhoneNumberSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private singlePTN$: Observable<boolean>;
  private currentEBillSettings$: Observable<Schemas.Ebill>;
  public selectedPhoneNumber$: Observable<string>;
  public currentBillingAddress$: Observable<Schemas.Address>;
  public selectizeOptions: ISelectizeOptions;
  public selectedBillingMethod$: Observable<string>;
  public emailForm: FormGroup;
  public subscriptionPhoneNumbers$: Observable<string[] | string>;
  public selectedLanguage$: Observable<string>;
  public userMustConfirmSave$: Observable<boolean>;
  public locked$: Observable<boolean>;
  public isASLAccount$: Observable<boolean>;
  public isCheckFree$: Observable<string>;
  public hideEmailButton: boolean;
  public notificationClosed: boolean;
  public checkFreeNotificationClosed: boolean;
  public changeAddress = 'changeAddress';
  public errorMessage: boolean;
  public subscriptionPhoneNumbersArray$: Observable<Schemas.AccountSubscription[]>;
  private contactInfo$: Observable<Schemas.IGetContactInfo>;
  private emailInputTouched: boolean;
  public detailedSelected: boolean;

  constructor(private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private ebillService: ManageEbillService,
              private userService: UserService,
              private subscriptionsService: SubscriptionsService,
              private applicationRef: ApplicationRef,
              private translateService: TranslateService
            ) {
              this.observableSubscriptions.push(
                this.router.events.subscribe(() => setTimeout(() => this.applicationRef.tick()))
              );
            }

  ngOnInit() {
    this.detailedSelected = null;
    this.errorMessage = false;
    this.emailInputTouched = false;
    this.trackEbillAnalytics();
    this.hideEmailButton = false;
    this.notificationClosed = true;
    this.checkFreeNotificationClosed = false;
    this.singlePTN$ = this.singlePTNSubject.asObservable();
    this.currentEBillSettings$ = this.ebillService.currentEBillSettings$;
    this.currentBillingAddress$ = this.ebillService.currentBillingAddress$;
    this.isASLAccount$ = this.ebillService.isASLAccount$;
    this.contactInfo$ = this.subscriptionsService.contactInfo$;
    this.subscriptionPhoneNumbersArray$ = this.subscriptionsService.subscriptions$;

    this.emailForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, CareFormValidators.emailValidator])
      ],
      disabled: [false]
    });

    this.isCheckFree$ =  this.currentEBillSettings$
      .map(checkFree => checkFree.billDeliveryMethod);

    this.selectedBillingMethod$ = Observable.combineLatest(
      this.currentEBillSettings$,
      this.selectedBillingMethodSubject.asObservable(),
      (getData, userSelection) => {
        if (userSelection === null) {
          this.changesMadeSubject.next(false);
        }
        if (userSelection && userSelection !== '') {
           this.changesMadeSubject.next(true);
           return userSelection;
        } else if (getData) {
          if (getData.enrolledInEMail) {
            this.emailForm.enable();
            return 'Email';
          } else if (getData.enrolledInText) {
            return 'Text';
          } else if (getData.optedForMail) {
            return 'Paper';
          } else {
            this.detailedSelected = true;
            return 'Detailed';
          }
        }
        return null;
      }
    ).do(() => {
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
    });

    this.selectedLanguage$ = Observable.combineLatest(
      this.currentEBillSettings$,
      this.selectedLanguageSubject.asObservable(),
      (getData, userSelection) => {
        if (userSelection === null) {
          this.changesMadeSubject.next(false);
        }
        if (userSelection && userSelection !== '') {
          return userSelection;
        } else if (getData) {
          return getData['billLanguage'];
        } else {
          return null;
        }
      }
    ).do(() => {
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
    });

    this.selectedPhoneNumber$ = Observable.combineLatest(
      this.currentEBillSettings$,
      this.selectedPhoneNumberSubject.asObservable(),
      this.userService.currentUser$,
      (getData, userSelection, currentUser) => {
        if (userSelection && userSelection.length > 0) {

          if (userSelection !== getData['phoneNumber']) {
            this.changesMadeSubject.next(true);
            return userSelection;
          } else {
            this.changesMadeSubject.next(false);
          }
          return userSelection;
        }
        else if (getData['phoneNumber']) {
          return getData['phoneNumber'];
        }
        else {
          return currentUser.accountSecurityContexts[0].deviceInHandMDN;
        }
      });

    this.subscriptionPhoneNumbers$ = Observable.combineLatest(
      this.subscriptionsService.subscriptions$,
      this.subscriptionsService.contactInfo$,
      (subscriptions: Schemas.AccountSubscription[], contactInfo: Schemas.IGetContactInfo) => {
        const ptns = contactInfo.textCapablePTNs || [];
        subscriptions.map((sub: Schemas.AccountSubscription) => {
          if (sub.status.toLowerCase() !== 'active') {
            if (ptns.indexOf(sub.ptn) > -1) {
              ptns.splice(ptns.indexOf(sub.ptn), 1);
            }
          }
        });
        return ptns;
      }).map((ptns) => {
        if (ptns && ptns.length > 1) {
          return ptns.map(phoneNumber => phoneNumber);

        } else if (ptns && ptns.length === 1) {
          this.enableSinglePTN();
          this.selectedPhoneNumberSubject.next(ptns[0]);
          return ptns;
        } else {
          return [];
        }
      }
    );

    const emailUpdateSub =
      this.userService.currentUser$
      .map(user => user && user.email
        ? user.email
        : null
      ).subscribe(
        emailAddress => {
          if (emailAddress && emailAddress !== this.emailForm.get('email').value) {
            this.emailForm.get('email').setValue(emailAddress);
          }
        }
      );
    this.observableSubscriptions.push(emailUpdateSub);

    this.userMustConfirmSave$ = Observable.combineLatest(
      this.isCheckFree$,
      this.selectedBillingMethod$
        .startWith(null),
      this.isASLAccount$
        .startWith(null),
      this.changesMadeSubject.asObservable(),
      this.selectedLanguageSubject.asObservable(),
      (checkFree, method, isASL, changes, language) => {
        if ((method === 'Paper' || method === 'Detailed') && isASL && changes  && !language) {
          return true;
        }
        else if (checkFree === 'C') {
          return true;
        }
        else {
          return false;
        }
      }
    ).do(() => {
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
    });

    this.locked$ = Observable.combineLatest(
      this.changesMadeSubject.asObservable(),
      this.selectedBillingMethod$,
      this.selectedLanguage$,
      this.emailForm.valueChanges
        .startWith(false),
      this.selectedPhoneNumber$
        .startWith(null),
      this.singlePTN$
        .startWith(false),
      (changesMade, billingMethod, language, email, phone, singlePTN) => {
        if (!billingMethod || !language || !changesMade ) {
          return true;
        }
        else if (billingMethod === 'Email' && this.emailForm.invalid) {
          return true;
        }
        else if (billingMethod === 'Email' && this.emailInputTouched === true && this.emailForm.valid) {
          return false;
        }
        return !(
        (billingMethod === 'Text' && changesMade) ||
        (billingMethod === 'Email' && changesMade) ||
        (billingMethod === 'Paper' &&  changesMade) ||
        (billingMethod === 'Detailed' && changesMade)
        );
      }
    )
    .startWith(true);
  }
// End Init Function

  emailInputTouchedFunc() {
    if (this.emailInputTouched === false) {
      this.emailInputTouched = true;
    }
  }

  formatPhoneNumber(ptn: string): string {
    return sprintApp.sharedMethods.phoneMethods.phoneToString(ptn)
  }

  ngOnDestroy() {
    this.observableSubscriptions.forEach(sub => sub.unsubscribe());
  }

  changeAddressOnProfilePage() {
     this.router.navigate(['/account', { outlets: { tab: ['contact-info'] } }]);
  }

  selectBillingMethod(event: any, method: string) {
    if (method === 'Detailed' && this.detailedSelected === false || null) {
      this.detailedSelected = true;
    }
    else if (method === 'Detailed' && this.detailedSelected === null) {
      method = 'Paper';
      this.detailedSelected = false;
    }
    else if (method === 'Detailed' && this.detailedSelected === true || null) {
      method = 'Paper';
      this.detailedSelected = false;
    }
    else if (method === 'Paper' && this.detailedSelected === true || null) {
      method = 'Detailed';
      this.detailedSelected = true;
    }
    else if (method === 'Paper' && this.detailedSelected === null) {
      this.detailedSelected = false;
    }

    let name: string;
    switch (method) {
      case 'Text':
        name = 'Text';
        this.checkToDisableNext();
        this.resetEmailForm();
        this.emailForm.disable();
        this.detailedSelected = false;
        break;
      case 'Email':
        name = 'Email';
        this.changesMadeSubject.next(true);
        this.emailForm.enable();
        this.detailedSelected = false;
        break;
      case 'Paper':
        name = 'Paper Statement';
        this.changesMadeSubject.next(true);
        this.resetEmailForm();
        this.emailForm.disable();
        break;
      case 'Detailed':
        name = 'Paper Statement Detailed Recurring Fee';
        this.changesMadeSubject.next(true);
        break;
    }
    // If we click on detailed bill, and it's already checked, we don't want to fire again
    if (event.target.value !== 'Detailed' || event.target.value === 'Detailed' && event.target.checked === true) {
      this.trackEbillAnalyticClicks(name);
    }
    this.selectedBillingMethodSubject.next(method);
  }


  resetEmailForm() {
      this.userService.currentUser$
      .map(user => user && user.email
        ? user.email
        : null
      ).subscribe(
        emailAddress => {
      this.emailForm.get('email').setValue(emailAddress)
    })
  }

  selectLanguage (lang: string) {
    // Analytics Billing Method
    this.selectedLanguageSubject.next(lang);
    this.checkToDisableNext();
    const language = lang === 'SPANISH' ? 'Spanish language' : 'English language';
    this.trackEbillAnalyticClicks(language);
  }

  /**
   * this function disables the save button if the previously saved item gets picked
   */
  checkToDisableNext() {
    const checkToDisableNext = Observable.combineLatest(
      this.currentEBillSettings$,
      this.selectedLanguage$,
      this.selectedBillingMethodSubject)
    .map(([eBillData, selectedLanguage, selectedBillingMethod]) => {
      if (eBillData.enrolledInText && selectedBillingMethod === 'Text') {
        (eBillData.billLanguage !== selectedLanguage) ? this.changesMadeSubject.next(true) : this.changesMadeSubject.next(false);
      } else {
        this.changesMadeSubject.next(true);
      }
    })
    .take(1)
    .subscribe();

    this.observableSubscriptions.push(checkToDisableNext);
  }

  enableEmailEdit() {
    this.emailEditingSubject.next(true);
    this.changesMadeSubject.next(true);
    this.emailForm.enable();
    this.hideEmailButton = true;
  }

  enableSinglePTN() {
    this.singlePTNSubject.next(true);
  }

  selectedPhoneChange(ptn: string) {
    if (ptn) {
      this.selectedPhoneNumberSubject.next(ptn);
    }
  }

  billDeliveryModalPopup() {
    this.billDeliveryModal.openBillDeliveryModal();
    this.selectedBillingMethodSubject.asObservable()
      .take(1)
      .subscribe(method => {
        let name: string;
        // Determining delivery method selected to push appropriate analytics
        if (method === 'Detailed') {
          name = 'Detailed Bill Recurring Fee Prompt';
        }
        if (method !== 'Detailed') {
          name = 'Spending Limit Program Fee Prompt';
        }
        if (method === 'Detailed' && 'userHasAccountSpendingLimit') {
          name = 'Spending Limit Program and Detailed Bill Fee Prompt';
        }
      });
  }

  // Logic for save button...
  onSave() {
    this.emailForm.disable();
    const eBillData$
      = Observable.combineLatest(
          this.selectedBillingMethod$,
          this.selectedLanguage$,
          Observable.of(this.emailForm.value['email']),
          this.selectedPhoneNumber$,
          this.currentEBillSettings$
        );
    eBillData$
      .take(1)
      .map(([method, billLanguage, emailId, phoneNumber, currentEbillSettings]) => {
        // Base PUT data object
        const result: {[key: string]: any} = {
          billLanguage
        };
        const setDefaultPhoneOrEmail = () => {
          if (currentEbillSettings['phoneNumber']) {
            result['phoneNumber'] = currentEbillSettings['phoneNumber'];
          } else {
            if (currentEbillSettings['emailId']) {
              result['emailId'] = currentEbillSettings['emailId'];
            }
          }
        };
        switch (method) {
          case 'Email':
            result['enrolledInEMail'] = true;
            result['enrolledInEBill'] = true;
            result['enrolledInText'] = false;
            result['optedForMail'] = false;
            result['emailId'] = emailId;
            break;
          case 'Text':
            result['enrolledInText'] = true;
            result['enrolledInEBill'] = true;
            result['enrolledInEMail'] = false;
            result['optedForMail'] = false;
            result['phoneNumber'] = phoneNumber;
            break;
          case 'Paper':
            result['optedForMail'] = true;
            result['enrolledInEMail'] = false;
            result['enrolledInText'] = false;
            result['enrolledInEBill'] = false;
            result['emailId'] = emailId;
            setDefaultPhoneOrEmail();
            break;
          case 'Detailed':
            result['enrolledInEMail'] = false;
            result['enrolledInText'] = false;
            result['enrolledInEBill'] = false;
            result['optedForMail'] = false;
            result['emailId'] = emailId;
            setDefaultPhoneOrEmail();
            break;
          default:
            result['enrolledInEBill'] = false;
        }
        return result;
      })
      .mergeMap(eBillData =>
        Observable.combineLatest(
          this.ebillService.updateEbill(eBillData),
          eBillData$,
          this.selectedBillingMethodSubject,
          this.selectedLanguageSubject)
      )
      .take(1)
      .subscribe(
        ([, eBillData, userSelectionBillType, langSelect]: [Object, string[], string | Object, string | Object]) => {
          this.changesMadeSubject.next(false);
          this.selectedBillingMethodSubject.next(null);
          this.selectedLanguageSubject.next(null);
          this.hideEmailButton = false;
          this.notificationClosed = false;
          sprintApp.sharedMethods.analyticsMethods.trackMessage(this.translateService.instant('mysprint:account:billing:billDeliveryOptions:changesConfirmed'));
        },
        (error) => {
          const errorCode = error.data.errors[0].errorCode;
          this.errorMessage = true;
          sprintApp.sharedMethods.analyticsMethods.trackMessage(this.translateService.instant(errorCode));
        }
      );
    this.checkFreeNotificationClosed = true;
    sprintApp.sharedMethods.scrollToMethods.smoothScrollTo(0, 0, 400);
  }

  cancelConfirmModal() {
    this.observableSubscriptions.push(
      this.changesMadeSubject.asObservable()
        .take(1)
        .subscribe((changesMade) => {
          if (changesMade) {
            this.manageEbillCancelModal.openModal();
          }
          else {
            this.goToPreviousPage();
          }
        }));
  }

  goToPreviousPage() {
    this.manageEbillCancelModal.closeModal();
    this.ebillService.goToPreviousPage();
  }

  private trackEbillAnalytics() {
    const pageData: IAnalyticsItem = sprintApp.sharedMethods.analyticsMethods.createAnalyticsItem({
      sdto: {
        page: {
          channel: 'MySprint',
          subSection: 'Preferences',
          name: 'Bill Delivery Options'
        }
      }
    });
    sprintApp.sharedMethods.analyticsMethods.trackPage(pageData);
  }

  /**
   * Analytics for click events
   * @param clickedName(str)
   */
  private trackEbillAnalyticClicks(clickedName: string) {
    const pageData: IAnalyticsItem = sprintApp.sharedMethods.analyticsMethods.createAnalyticsItem({
      sdto: {
        page: {
          channel: 'MySprint',
          subSection: 'Preferences',
          name: 'Bill Delivery Options',
          interaction: {
            userSelection: `Bill Delivery Options - ${clickedName}`
          }
        }
      }
    });
    sprintApp.sharedMethods.analyticsMethods.trackClick(pageData);
  }

  closeNotificationBar() {
    this.notificationClosed = true;
  }

  closeCheckFreeNotificationBar() {
    this.checkFreeNotificationClosed = true;
  }
}
