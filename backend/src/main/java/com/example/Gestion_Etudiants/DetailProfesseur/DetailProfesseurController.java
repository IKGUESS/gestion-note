package com.example.Gestion_Etudiants.DetailProfesseur;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/details-professeurs-modules")
public class DetailProfesseurController {

    private final DetailProfesseurService detailService;

    public DetailProfesseurController(DetailProfesseurService detailService) {
        this.detailService = detailService;
    }

    @GetMapping
    public List<DetailProfesseurs> getAllDetails() {
        return detailService.getAllDetails();
    }

    @GetMapping("/professeur/{cin}/module/{codeMod}")
    public DetailProfesseurs getDetailByProfesseurAndModule(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        return detailService.getDetailByProfesseurAndModule(cin, codeMod);
    }

    @GetMapping("/professeur/{cin}")
    public List<DetailProfesseurs> getDetailsByProfesseur(@PathVariable String cin) {
        return detailService.getDetailsByProfesseur(cin);
    }

    @GetMapping("/module/{codeMod}")
    public List<DetailProfesseurs> getDetailsByModule(@PathVariable String codeMod) {
        return detailService.getDetailsByModule(codeMod);
    }

    @PostMapping
    public DetailProfesseurs createDetail(@RequestBody DetailProfesseurs detail) {
        return detailService.createDetail(detail);
    }

    @PutMapping("/professeur/{cin}/module/{codeMod}")
    public DetailProfesseurs updateDetail(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @RequestBody DetailProfesseurs detail) {
        return detailService.updateDetail(cin, codeMod, detail);
    }

    @DeleteMapping("/professeur/{cin}/module/{codeMod}")
    public ResponseEntity<?> deleteDetail(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        detailService.deleteDetail(cin, codeMod);
        return ResponseEntity.ok().build();
    }
}