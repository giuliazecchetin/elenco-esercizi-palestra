import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise } from './models/exercise';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('gym-app');
  private readonly STORAGE_KEY = 'gym_exercises';
  
  exercises: Exercise[] = [];
  showModal = false;
  editingId: number | null = null;
  showConfirm = false;
  confirmMessage = '';
  
  formData: Exercise = {
    id: 0,
    name: '',
    muscleGroup: '',
    sets: 3,
    reps: 10,
    weightKg: undefined,
    notes: ''
  };

  private defaultExercises: Exercise[] = [
  {
    id: 1,
    name: 'Panca piana con bilanciere',
    muscleGroup: 'petto',
    sets: 3,
    reps: 8,
    weightKg: 50,
    notes: 'Focus sulla tecnica, niente rimbalzi'
  },
  {
    id: 2,
    name: 'Lat machine avanti',
    muscleGroup: 'schiena',
    sets: 3,
    reps: 10,
    weightKg: 40,
    notes: 'Tirare al petto senza slanci'
  },
  {
    id: 3,
    name: 'Squat al multipower',
    muscleGroup: 'gambe',
    sets: 4,
    reps: 8,
    weightKg: 60,
    notes: 'Scendere almeno a parallelo'
  },
  {
    id: 4,
    name: 'Curl manubri in piedi',
    muscleGroup: 'bicipiti',
    sets: 3,
    reps: 12,
    weightKg: 10
  },
  {
    id: 5,
    name: 'French press bilanciere EZ',
    muscleGroup: 'tricipiti',
    sets: 3,
    reps: 10,
    weightKg: 25
  },
  {
    id: 6,
    name: 'Plank',
    muscleGroup: 'core',
    sets: 3,
    reps: 30,
    notes: '30 secondi a serie'
  }
];

  ngOnInit() {
    this.loadExercises();
  }

  private loadExercises() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.exercises = JSON.parse(saved);
      } catch (error) {
        console.error('Errore nel caricamento degli esercizi:', error);
        this.exercises = [...this.defaultExercises];
        this.saveExercises();
      }
    } else {
      this.exercises = [...this.defaultExercises];
      this.saveExercises();
    }
  }

  private saveExercises() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.exercises));
  }

  insertExercise() {
    this.editingId = null;
    this.formData = {
      id: 0,
      name: '',
      muscleGroup: '',
      sets: 3,
      reps: 10,
      weightKg: undefined,
      notes: ''
    };
    this.showModal = true;
  }

  editExercise(id: number) {
    const exercise = this.exercises.find(ex => ex.id === id);
    if (exercise) {
      this.editingId = id;
      this.formData = { ...exercise };
      this.showModal = true;
    }
  }

  saveExercise() {
    if (!this.formData.name.trim() || !this.formData.muscleGroup.trim()) {
      alert('Nome e Gruppo muscolare sono obbligatori!');
      return;
    }

    if (this.editingId) {
      // Modifica esercizio esistente
      const index = this.exercises.findIndex(ex => ex.id === this.editingId);
      if (index !== -1) {
        this.exercises[index] = this.formData;
      }
    } else {
      // Inserisci nuovo esercizio
      const newId = this.exercises.length > 0 ? Math.max(...this.exercises.map(ex => ex.id)) + 1 : 1;
      this.formData.id = newId;
      this.exercises.push({ ...this.formData });
    }

    this.saveExercises();
    const isEdit = !!this.editingId;
    this.confirmMessage = isEdit ? 'Esercizio modificato! ✏️' : 'Esercizio aggiunto! ➕';
    this.showConfirm = true;
    this.closeModal();
    setTimeout(() => {
      this.showConfirm = false;
    }, 2000);
  }

  closeConfirm() {
    this.showConfirm = false;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  deleteExercise(id: number) {
    const confirmed = confirm(`Sei sicuro di voler eliminare questo esercizio? 🗑️`);
    if (confirmed) {
      this.exercises = this.exercises.filter(ex => ex.id !== id);
      this.saveExercises();
      alert('Esercizio eliminato! ✅');
    }
  }

}
