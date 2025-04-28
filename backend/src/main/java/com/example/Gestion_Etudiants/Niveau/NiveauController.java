package com.example.Gestion_Etudiants.Niveau;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/niveaux")
public class NiveauController {

	private final NiveauService niveauService;

	public NiveauController(NiveauService niveauService) {
		this.niveauService = niveauService;
	}

	@GetMapping
	public List<niveau> getAllNiveaux() {
		return niveauService.getAllNiveaux();
	}

	@GetMapping("/{codeNiv}")
	public niveau getNiveauById(@PathVariable String codeNiv) {
		return niveauService.getNiveauById(codeNiv);
	}

	@PostMapping
	public niveau createNiveau(@RequestBody niveau niveau) {
		return niveauService.createNiveau(niveau);
	}

	@PutMapping("/{codeNiv}")
	public niveau updateNiveau(@PathVariable String codeNiv, @RequestBody niveau niveau) {
		return niveauService.updateNiveau(codeNiv, niveau);
	}

	@DeleteMapping("/{codeNiv}")
	public ResponseEntity<?> deleteNiveau(@PathVariable String codeNiv) {
		niveauService.deleteNiveau(codeNiv);
		return ResponseEntity.ok().build();
	}
}