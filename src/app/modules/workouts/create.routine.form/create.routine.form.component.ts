import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { UploadService } from './../../../services/uploads/shared/upload.service';
import { Upload } from './../../../services/uploads/shared/upload';
import { Exercise } from './../../../models/exercise';
import { AbstractControl, FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from './../../../services/auth.service';
import { WorkoutData } from './../../../services/workouts-data.service';
import { ModelFactory } from './../../../services/factories/model.factory';
import { Routine } from './../../../models/routine';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Category } from '../../../enums/workoutCategories';

@Component({
  selector: 'app-create-routine',
  templateUrl: './create.routine.form.component.html',
  styleUrls: ['./create.routine.form.component.css']
})
export class CreateRoutineFormComponent implements OnInit {
  public routine: Routine;
  private factory: ModelFactory;
  private workoutDataService: WorkoutData;
  private auth: AuthService;
  public routineForm: FormGroup;
  public exercises: Array<Exercise>;
  public showExerciseForm: boolean;

  public exerciseFormControl: AbstractControl;
  public seriesFormControl: AbstractControl;
  public repeatsFormControl: AbstractControl;
  public restingFormControl: AbstractControl;

   constructor(
    @Inject(MD_DIALOG_DATA) public data: WorkoutData,
    public dialog: MdDialog,
    workoutDataService: WorkoutData,
    factory: ModelFactory,
    auth: AuthService,
    public dialogRef: MdDialogRef<CreateRoutineFormComponent>,
    private formBuilder: FormBuilder) {
    this.factory = factory;
    this.workoutDataService = workoutDataService;
    this.auth = auth;
    this.routine = new Routine();
    this.routine.exercise = new Exercise();
    this.exercises = new Array<Exercise>();
    this.showExerciseForm = false;
}


  ngOnInit(): void {
      this.exerciseFormControl = new FormControl('', [
      Validators.required]);

    this.seriesFormControl = new FormControl('', [
      Validators.required]);

    this.repeatsFormControl = new FormControl('', [
      Validators.required]);

    this.restingFormControl = new FormControl('', [
      Validators.required]);

    this.routineForm = this.formBuilder.group({
      exerciseFormControl: this.exerciseFormControl,
      seriesFormControl: this.seriesFormControl,
      repeatsFormControl: this.repeatsFormControl,
      restingFormControl: this.restingFormControl
    });

    this.workoutDataService.getAvailableExercises().subscribe(items => {
      this.exercises = new Array<Exercise>();
        items.forEach(item => {
          const newExercise = new Exercise(item.name);
          this.exercises.push(newExercise);
        });
    });
  }

  addExercise(option) {
    const addExerciseString = 'showForm';
    if (option.value === addExerciseString) {
      this.showExerciseForm = true;
    } else {
      this.showExerciseForm = false;
    }
  }
  hideExerciseForm() {
    this.showExerciseForm = false;
  }
  onSubmit(exercise: Exercise,
    series: number,
    repeats: number,
    resting: number) {
          exercise = new Exercise(this.routine.exercise.name);
          series = this.routine.seriesCount;
          repeats = this.routine.repeatTimes;
          resting = this.routine.restingTime;

      this.routine = this.factory
      .createRoutine(exercise, repeats, series, resting);
      this.workoutDataService.addRoutine(this.routine);
      this.dialogRef.close();
  }
}