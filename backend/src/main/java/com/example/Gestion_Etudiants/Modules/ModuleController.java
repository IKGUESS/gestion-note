package com.example.Gestion_Etudiants.Modules;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/modules")
public class ModuleController {

	private final ModuleService moduleService;

	public ModuleController(ModuleService moduleService) {
		this.moduleService = moduleService;
	}

	@GetMapping
	public List<Module> getAllModules() {
		return moduleService.getAllModules();
	}

	@GetMapping("/{codeMod}")
	public Module getModuleById(@PathVariable String codeMod) {
		return moduleService.getModuleById(codeMod);
	}

	@GetMapping("/niveau-scolaire/{codeNivSco}")
	public List<Module> getModulesByNiveauScolaire(@PathVariable String codeNivSco) {
		return moduleService.getModulesByNiveauScolaire(codeNivSco);
	}

	@GetMapping("/filiere/{codeFil}")
	public List<Module> getModulesByFiliere(@PathVariable String codeFil) {
		return moduleService.getModulesByFiliere(codeFil);
	}

	@PostMapping
	public Module createModule(@RequestBody Module module) {
		return moduleService.createModule(module);
	}

	@PutMapping("/{codeMod}")
	public Module updateModule(@PathVariable String codeMod, @RequestBody Module module) {
		return moduleService.updateModule(codeMod, module);
	}

	@DeleteMapping("/{codeMod}")
	public ResponseEntity<?> deleteModule(@PathVariable String codeMod) {
		moduleService.deleteModule(codeMod);
		return ResponseEntity.ok().build();
	}
}