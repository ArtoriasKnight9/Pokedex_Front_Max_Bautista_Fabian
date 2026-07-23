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
    this.pokemonService.getPokemons().subscribe(data => {
      this.pokemons = data;
      this.pokemons.sort((a, b) => a.name_pokemon.localeCompare(b.name_pokemon));
      this.extractTypes();
      this.applyFilter();
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
    const allTypes = this.pokemons.map(p => p.type_pokemon);
    this.types = [...new Set(allTypes)];

    let result = this.pokemons;

    if (this.activeTrainer) {
      result = result.filter(p => p.trainerOwner.uuid_trainer === this.activeTrainer!.uuid_trainer);
    }

    if (this.selectedType) {
      result = result.filter(p => p.type_pokemon === this.selectedType);
    }

    this.filteredPokemons = result;
  }

  getTypeColor(type: string): string {
    if (!type) return '#3b4cca'; 

    // Agregamos .trim() para limpiar espacios fantasma al inicio o final
    const t = type.toLowerCase().trim();

    if (t.includes('fuego')) return '#F08030';      
    if (t.includes('agua')) return '#6890F0';       
    if (t.includes('planta')) return '#78C850';     
    if (t.includes('eléctrico') || t.includes('electrico')) return '#F8D030'; 
    if (t.includes('fantasma')) return '#705898';   
    if (t.includes('bicho')) return '#A8B820';      
    if (t.includes('veneno')) return '#A040A0';     
    if (t.includes('lucha')) return '#C03028';      
    if (t.includes('normal')) return '#A8A878';     
    if (t.includes('volador')) return '#A890F0';    
    if (t.includes('tierra')) return '#E0C068';     
    if (t.includes('roca')) return '#B8A038';       
    if (t.includes('hielo')) return '#98D8D8';      
    if (t.includes('psíquico') || t.includes('psiquico')) return '#F85888'; 
    if (t.includes('dragón') || t.includes('dragon')) return '#7038F8';     

    return '#3b4cca'; 
  }

  getPokemonSprite(name: string): string {
    if (!name) return '/assets/Pokeicon.svg'; 
    const cleanName = name.toLowerCase().trim().replace(/\s+/g, '');

    return `https://play.pokemonshowdown.com/sprites/gen1/${cleanName}.png`;

  }

  registerPokemon() {

    if (!this.newPokemon.name_pokemon || this.newPokemon.name_pokemon.trim() === '') {
      alert('Introduce nombre del pokemon que capturaste');
      return; 
    }

    if (!this.newPokemon.type_pokemon || this.newPokemon.type_pokemon.trim() === '') {
      alert('Por favor, indica el tipo de tu Pokémon (ej. Fuego, Agua)');
      return; 
    }

    if (!this.newPokemon.level_pokemon || this.newPokemon.level_pokemon < 1) {
      alert('El nivel del Pokémon debe ser al menos 1');
      return;
    }

    this.pokemonService.registerPokemon(this.newPokemon as Pokemon).subscribe(() => {
      this.loadPokemons(); 
      
      // Limpiamos los campos del formulario para el siguiente registro
      this.newPokemon.name_pokemon = '';
      this.newPokemon.type_pokemon = '';
      this.newPokemon.level_pokemon = 1;
    });
  }

 levelUp(pokemon: any) {
    const newLevel = pokemon.level_pokemon + 1;

    this.pokemonService.levelUpPokemon(pokemon.uuid_pokemon, newLevel).subscribe(() => {
      
      alert(`¡Subiste un nivel a ${pokemon.name_pokemon}! Ahora es nivel ${newLevel}.`);
      
      this.loadPokemons(); 
    });
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