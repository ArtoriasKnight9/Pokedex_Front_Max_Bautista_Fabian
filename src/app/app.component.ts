import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService, Pokemon, Trainer } from './services/pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  
  types: string[] = [];
  selectedType: string = '';
  trainers: Trainer[] = [];
  
  // NUEVO: Estado del entrenador activo
  activeTrainer: Trainer | null = null;

  newPokemon: Partial<Pokemon> = {
    name_pokemon: '',
    type_pokemon: '',
    level_pokemon: 1,
    captureDate: new Date().toISOString().split('T')[0],
    trainerOwner: { uuid_trainer: '' } as Trainer
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadTrainers();
    this.loadPokemons();
  }

  loadTrainers() {
    this.pokemonService.getTrainers().subscribe({
      next: (data) => this.trainers = data,
      error: (err) => console.error('Error al cargar entrenadores', err)
    });
  }

  loadPokemons() {
    this.pokemonService.getPokemons().subscribe({
      next: (data) => {
        this.pokemons = data;
        this.extractTypes();
        this.applyFilter();
      },
      error: (err) => console.error('Error al cargar Pokémon', err)
    });
  }

  // Seleccionar entrenador anres del CRUD de Pokémon
  selectTrainer(trainer: Trainer) {
    this.activeTrainer = trainer;
    this.newPokemon.trainerOwner = trainer;
    this.applyFilter();
  }

  // Función para salir al menú principal
  logout() {
    this.activeTrainer = null;
    this.selectedType = '';
    this.applyFilter();
  }

  extractTypes() {
    const allTypes = this.pokemons.map(p => p.type_pokemon);
    this.types = [...new Set(allTypes)]; 
  }

  applyFilter() {
    let result = this.pokemons;

    // 1. Filtrar por el entrenador activo (si hay uno)
    if (this.activeTrainer) {
      result = result.filter(p => p.trainerOwner.uuid_trainer === this.activeTrainer!.uuid_trainer);
    }

    // 2. Aplicar el filtro de tipo (Agua, Fuego, etc.)
    if (this.selectedType) {
      result = result.filter(p => p.type_pokemon === this.selectedType);
    }

    this.filteredPokemons = result;
  }

  registerPokemon() {
    if(this.newPokemon.name_pokemon && this.newPokemon.type_pokemon) {
      this.pokemonService.registerPokemon(this.newPokemon as Pokemon).subscribe(() => {
        this.loadPokemons(); 
        this.newPokemon.name_pokemon = '';
        this.newPokemon.type_pokemon = '';
        this.newPokemon.level_pokemon = 1;
      });
    } else {
      alert('Por favor, ingresa un nombre y un tipo.');
    }
  }

  levelUp(pokemon: Pokemon) {
    if(pokemon.uuid_pokemon) {
      this.pokemonService.levelUpPokemon(pokemon.uuid_pokemon, pokemon.level_pokemon + 1).subscribe(() => {
         this.loadPokemons();
      });
    }
  }

  deletePokemon(uuid: string | undefined) {
    if(!uuid) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas liberar a este Pokémon?');
    if (confirmDelete) {
      this.pokemonService.deletePokemon(uuid).subscribe(() => {
        this.loadPokemons();
      });
    }
  }
}