package com.example.Gestion_Etudiants.NiveauEtude;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/niveaux-scolaires")
public class NiveauEtudeController {

	private final NiveauEtudeService niveauEtudeService;

	public NiveauEtudeController(NiveauEtudeService niveauEtudeService) {
		this.niveauEtudeService = niveauEtudeService;
	}

	@GetMapping
	public List<niveauEtd> getAllNiveauxScolaires() {
		return niveauEtudeService.getAllNiveauxScolaires();
	}

	@GetMapping("/{codeNivSco}")
	public niveauEtd getNiveauScolaireById(@PathVariable String codeNivSco) {
		return niveauEtudeService.getNiveauScolaireById(codeNivSco);
	}

	@GetMapping("/filiere/{codeFil}")
	public List<niveauEtd> getNiveauxScolairesByFiliere(@PathVariable String codeFil) {
		return niveauEtudeService.getNiveauxScolairesByFiliere(codeFil);
	}

	@PostMapping
	public niveauEtd createNiveauScolaire(@RequestBody niveauEtd niveauScolaire) {
		return niveauEtudeService.createNiveauScolaire(niveauScolaire);
	}

	@PutMapping("/{codeNivSco}")
	public niveauEtd updateNiveauScolaire(@PathVariable String codeNivSco, @RequestBody niveauEtd niveauScolaire) {
		return niveauEtudeService.updateNiveauScolaire(codeNivSco, niveauScolaire);
	}

	@DeleteMapping("/{codeNivSco}")
	public ResponseEntity<?> deleteNiveauScolaire(@PathVariable String codeNivSco) {
		niveauEtudeService.deleteNiveauScolaire(codeNivSco);
		return ResponseEntity.ok().build();
	}
}