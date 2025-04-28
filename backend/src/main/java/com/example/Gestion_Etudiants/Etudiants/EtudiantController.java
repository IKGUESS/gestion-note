package com.example.Gestion_Etudiants.Etudiants;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

	private final EtudiantService etudiantService;

	public EtudiantController(EtudiantService etudiantService) {
		this.etudiantService = etudiantService;
	}

	@GetMapping
	public List<Etudiant> getAllEtudiants() {
		return etudiantService.getAllEtudiants();
	}

	@GetMapping("/{cin}")
	public Etudiant getEtudiantById(@PathVariable String cin) {
		return etudiantService.getEtudiantById(cin);
	}

	@PostMapping
	public Etudiant createEtudiant(@RequestBody Etudiant etudiant) {
		return etudiantService.createEtudiant(etudiant);
	}

	@PutMapping("/{cin}")
	public Etudiant updateEtudiant(@PathVariable String cin, @RequestBody Etudiant etudiant) {
		return etudiantService.updateEtudiant(cin, etudiant);
	}

	@DeleteMapping("/{cin}")
	public ResponseEntity<?> deleteEtudiant(@PathVariable String cin) {
		etudiantService.deleteEtudiant(cin);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/filiere/{codeFil}")
	public List<Etudiant> getEtudiantsByFiliere(@PathVariable String codeFil) {
		return etudiantService.getEtudiantsByFiliere(codeFil);
	}
}