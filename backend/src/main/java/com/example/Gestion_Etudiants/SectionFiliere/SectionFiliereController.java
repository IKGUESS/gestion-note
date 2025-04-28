package com.example.Gestion_Etudiants.SectionFiliere;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/section-filieres")
public class SectionFiliereController {

	private final SectionFiliereService sectionFiliereService;

	public SectionFiliereController(SectionFiliereService sectionFiliereService) {
		this.sectionFiliereService = sectionFiliereService;
	}

	@GetMapping
	public List<SectionFilier> getAllSectionFilieres() {
		return sectionFiliereService.getAllSectionFilieres();
	}

	@GetMapping("/filiere/{codeFil}/section/{codeSec}")
	public SectionFilier getSectionFiliereByCodes(
			@PathVariable String codeFil,
			@PathVariable String codeSec) {
		return sectionFiliereService.getSectionFiliereByCodes(codeFil, codeSec);
	}

	@GetMapping("/filiere/{codeFil}")
	public List<SectionFilier> getSectionFilieresByFiliere(@PathVariable String codeFil) {
		return sectionFiliereService.getSectionFilieresByFiliere(codeFil);
	}

	@GetMapping("/section/{codeSec}")
	public List<SectionFilier> getSectionFilieresBySection(@PathVariable String codeSec) {
		return sectionFiliereService.getSectionFilieresBySection(codeSec);
	}

	@GetMapping("/designation/{designation}")
	public List<SectionFilier> getSectionFilieresByDesignation(@PathVariable String designation) {
		return sectionFiliereService.getSectionFilieresByFiliereDesignation(designation);
	}

	@PostMapping
	public SectionFilier createSectionFiliere(@RequestBody SectionFilier sectionFilier) {
		return sectionFiliereService.createSectionFiliere(sectionFilier);
	}

	@DeleteMapping("/filiere/{codeFil}/section/{codeSec}")
	public ResponseEntity<?> deleteSectionFiliere(
			@PathVariable String codeFil,
			@PathVariable String codeSec) {
		sectionFiliereService.deleteSectionFiliere(codeFil, codeSec);
		return ResponseEntity.ok().build();
	}
}