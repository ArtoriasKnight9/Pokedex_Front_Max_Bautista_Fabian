import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para el Entrenador (basada en tu backend)
export interface Trainer {
  uuid_trainer: string;
  name_trainer: string;
  age_trainer: number;
  gender_trainer: string;
  region_trainer: string;
  number_of_pokemons: number;
}

// Interfaz para el Pokémon
export interface Pokemon {
  uuid_pokemon?: string; // Es opcional porque al registrar uno nuevo, el backend lo genera
  name_pokemon: string;
  type_pokemon: string;
  level_pokemon: number;
  captureDate: string;
  trainerOwner: Trainer;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  // La ruta de tu API en Spring Boot
  private apiUrl = 'http://localhost:8080/api/pokemons';

  constructor(private http: HttpClient) { }

  // 1. Mostrar todos los Pokémon
  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl);
  }

  // 2. Registrar un nuevo Pokémon
  registerPokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.apiUrl, pokemon);
  }

  // 3. Subir de nivel un Pokémon
  levelUpPokemon(uuid: string, newLevel: number): Observable<Pokemon> {
    return this.http.patch<Pokemon>(`${this.apiUrl}/${uuid}/level?newLevel=${newLevel}`, {});
  }

  // 4. Eliminar un Pokémon
  deletePokemon(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }

  // 5. Obtener todos los entrenadores
  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>('http://localhost:8080/api/trainers');
  }
}