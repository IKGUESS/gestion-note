package com.example.Gestion_Etudiants.Filieres;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

	private final FiliereService filiereService;

	public FiliereController(FiliereService filiereService) {
		this.filiereService = filiereService;
	}

	@GetMapping
	public List<Filiere> getAllFilieres() {
		return filiereService.getAllFilieres();
	}

	@GetMapping("/{codeFil}")
	public Filiere getFiliereById(@PathVariable String codeFil) {
		return filiereService.getFiliereById(codeFil);
	}

	@GetMapping("/niveau/{codeNiv}")
	public List<Filiere> getFilieresByNiveau(@PathVariable String codeNiv) {
		return filiereService.getFilieresByCodeNiveau(codeNiv);
	}

	@GetMapping("/responsable/{cin}")
	public List<Filiere> getFilieresByResponsable(@PathVariable String cin) {
		return filiereService.getFilieresByResponsable(cin);
	}

	@PostMapping
	public Filiere createFiliere(@RequestBody Filiere filiere) {
		return filiereService.createFiliere(filiere);
	}

	@PutMapping("/{codeFil}")
	public Filiere updateFiliere(@PathVariable String codeFil, @RequestBody Filiere filiere) {
		return filiereService.updateFiliere(codeFil, filiere);
	}

	@DeleteMapping("/{codeFil}")
	public ResponseEntity<?> deleteFiliere(@PathVariable String codeFil) {
		filiereService.deleteFiliere(codeFil);
		return ResponseEntity.ok().build();
	}
}