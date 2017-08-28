import { UserData } from './../../../services/user-data.service';
import { ActivityData } from './../../../services/activity-data.service';
import { ActivityInterface } from './../../../interfaces/activity';
import { Component, OnInit } from '@angular/core';
import { FormControl, AbstractControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Activity } from '../../../models/activity';
import { AuthService } from '../../../services/auth.service';
import { Upload } from '../../../services/uploads/shared/upload';
import { UploadService } from '../../../services/uploads/shared/upload.service';
import { ModelFactory } from '../../../services/factories/model.factory';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css'],
})
export class CreateActivityComponent implements OnInit {
  public recipeForm: FormGroup;
  public title: string;
  public category: string;
  public description: string;
  public inputLocation;
  public location = {
    place: '',
    lat: '',
    lng: ''
  };
  public dateAndTime: string;
  public upload;
  public activityKey: string;
  public activity: ActivityInterface;

  public titleFormControl: AbstractControl;
  public authorFormControl: AbstractControl;
  public categoryFormControl: AbstractControl;
  public descriptionFormControl: AbstractControl;
  public locationFormControl: AbstractControl;
  public eventDateFormControl: AbstractControl;

  public categories = [
    'Bicycling',
    'Dancing',
    'Music Playing',
    'Running',
    'Educational',
    'Kids',
    'Water Activities',
    'Winter Activities',
    'Volunteer Activities'];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private uploadService: UploadService,
    private factory: ModelFactory,
    private activityData: ActivityData,
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserData) {
  }

  ngOnInit(): void {
    this.titleFormControl = new FormControl('', [
      Validators.required]);

    this.authorFormControl = new FormControl('', [
      Validators.required]);

    this.categoryFormControl = new FormControl('', [
      Validators.required]);

    this.descriptionFormControl = new FormControl('', [
      Validators.required]);

    this.locationFormControl = new FormControl('', [
      Validators.required]);

    this.eventDateFormControl = new FormControl('', [
      Validators.required]);


    this.recipeForm = this.formBuilder.group({
      titleFormControl: this.titleFormControl,
      authorFormControl: this.authorFormControl,
      categoryFormControl: this.categoryFormControl,
      descriptionFormControl: this.descriptionFormControl,
      locationFormControl: this.authorFormControl,
      eventDateFormControl: this.categoryFormControl,
      createdOnFormControl: this.descriptionFormControl,
    });
  }

  detectFile(event) {
    this.upload = event.target.files.item(0);
  }

  uploadFile() {
    const userId = this.auth.currentUserId;
    const file = this.upload;
    console.log(this.activityData.getActivityById(this.activityKey));
    console.log(this.activityKey);
    const dbPath = `activities/${this.activityKey}/image`;
    const storagePath = `images/activities/${this.activityKey}`;

    this.upload = new Upload(file);
    this.uploadService.uploadFile(storagePath, dbPath, this.upload);
  }

  getLocation(place: Object) {
    this.location.place = place['formatted_address'];
    const location = place['geometry']['location'];
    this.location.lat = location.lat();
    this.location.lng = location.lng();
  }

  setMoment(dateAndTime: any): any {
    this.dateAndTime = dateAndTime;
  }

  onSubmit() {
    const userId = this.auth.currentUserId;
    const author = this.auth.currentUserDisplayName;

    this.activity = this.factory
      .createActivity(
      userId,
      this.title,
      author,
      this.category,
      this.description,
      this.location,
      this.dateAndTime.toString(),
      Date.now(),
      null,
      [],
      []);

    this.activityData
      .add(this.activity)
      .then(activityKey => {
        if (this.upload !== null) {
          this.activityKey = activityKey;
        }
      })
      .then(() => this.uploadFile());
    // this.router.navigateByUrl('/activities/all');
    this.notificationService.popToast('success', 'Success!', 'Activity added');
  }

  test() {
    console.log(this.userService.getUserByUid(this.auth.currentUserId));
    console.log(this.activityKey);
    console.log(this.activityData.getActivityById(this.activityKey));
  }
}
