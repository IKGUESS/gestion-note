package com.example.Gestion_Etudiants.Presences;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Long> {

	@Query("SELECT p FROM Presence p WHERE p.etudiant.cin = :cin AND p.module.codeMod = :codeMod")
	Presence findByEtudiantCinAndModuleCodeMod(@Param("cin") String cin, @Param("codeMod") String codeMod);

	@Query("SELECT p FROM Presence p WHERE p.etudiant.cin = :cin")
	List<Presence> findByEtudiantCin(@Param("cin") String cin);

	@Query("SELECT p FROM Presence p JOIN FETCH p.etudiant")
	List<Presence> findAllWithEtudiant();

	void deleteByEtudiant_Cin(String cin);



}