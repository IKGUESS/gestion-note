package com.example.Gestion_Etudiants.Section;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/sections")
public class SectionController {

	private final SectionService sectionService;

	public SectionController(SectionService sectionService) {
		this.sectionService = sectionService;
	}

	@GetMapping
	public List<Section> getAllSections() {
		return sectionService.getAllSections();
	}

	@GetMapping("/{codeSec}")
	public Section getSectionById(@PathVariable String codeSec) {
		return sectionService.getSectionById(codeSec);
	}

	@PostMapping
	public Section createSection(@RequestBody Section section) {
		return sectionService.createSection(section);
	}

	@PutMapping("/{codeSec}")
	public Section updateSection(@PathVariable String codeSec, @RequestBody Section section) {
		return sectionService.updateSection(codeSec, section);
	}

	@DeleteMapping("/{codeSec}")
	public ResponseEntity<?> deleteSection(@PathVariable String codeSec) {
		sectionService.deleteSection(codeSec);
		return ResponseEntity.ok().build();
	}
}