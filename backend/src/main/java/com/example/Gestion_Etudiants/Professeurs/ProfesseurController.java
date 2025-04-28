package com.example.Gestion_Etudiants.Professeurs;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/professeurs")
public class ProfesseurController {

	private final ProfesseurService professeurService;

	public ProfesseurController(ProfesseurService professeurService) {
		this.professeurService = professeurService;
	}

	@GetMapping
	public List<Professeur> getAllProfesseurs() {
		return professeurService.getAllProfesseurs();
	}

	@GetMapping("/{id}")
	public Professeur getProfesseurById(@PathVariable Long id) {
		return professeurService.getProfesseurById(id);
	}

	@GetMapping("/cin/{cin}")
	public Professeur getProfesseurByCin(@PathVariable String cin) {
		return professeurService.getProfesseurByCin(cin);
	}

	@PostMapping
	public Professeur createProfesseur(@RequestBody Professeur professeur) {
		return professeurService.createProfesseur(professeur);
	}

	@PutMapping("/{id}")
	public Professeur updateProfesseur(@PathVariable Long id, @RequestBody Professeur professeur) {
		return professeurService.updateProfesseur(id, professeur);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProfesseur(@PathVariable Long id) {
		professeurService.deleteProfesseur(id);
		return ResponseEntity.ok().build();
	}
}