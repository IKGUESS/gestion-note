package com.example.Gestion_Etudiants.DetailProfesseur;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetailProfesseurRepository extends JpaRepository<DetailProfesseurs, Long> {

    DetailProfesseurs findByProfesseurCinAndModuleCodeMod(String cin, String codeMod);

    List<DetailProfesseurs> findByProfesseurCin(String cin);

    List<DetailProfesseurs> findByModuleCodeMod(String codeMod);
}