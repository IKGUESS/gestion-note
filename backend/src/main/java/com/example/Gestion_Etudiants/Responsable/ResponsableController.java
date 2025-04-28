package com.example.Gestion_Etudiants.Responsable;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/responsables")
public class ResponsableController {

	private final ResponsableService responsableService;

	public ResponsableController(ResponsableService responsableService) {
		this.responsableService = responsableService;
	}

	@GetMapping
	public List<Responsable> getAllResponsables() {
		return responsableService.getAllResponsables();
	}

	@GetMapping("/{cin}")
	public Responsable getResponsableById(@PathVariable String cin) {
		return responsableService.getResponsableById(cin);
	}

	@PostMapping
	public Responsable createResponsable(@RequestBody Responsable responsable) {
		return responsableService.createResponsable(responsable);
	}

	@PutMapping("/{cin}")
	public Responsable updateResponsable(@PathVariable String cin, @RequestBody Responsable responsable) {
		return responsableService.updateResponsable(cin, responsable);
	}

	@DeleteMapping("/{cin}")
	public ResponseEntity<?> deleteResponsable(@PathVariable String cin) {
		responsableService.deleteResponsable(cin);
		return ResponseEntity.ok().build();
	}
}