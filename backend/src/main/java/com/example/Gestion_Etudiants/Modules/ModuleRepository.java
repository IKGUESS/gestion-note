package com.example.Gestion_Etudiants.Modules;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, String> {

	@Query("SELECT m FROM Module m JOIN m.niveauEtd ns WHERE ns.codeNivSco = :codeNivSco")
	List<Module> findModulesByCodeniveauEtd(@Param("codeNivSco") String codeNivSco);

	Module findModuleByCodeMod(String codeMod);

	@Modifying
	@Query("DELETE FROM Module m WHERE m.niveauEtd.codeNivSco = :codeNivSco")
	void deleteAllModulesByCodeNivSco(@Param("codeNivSco") String codeNivSco);

	List<Module> getAllByniveauEtd_Filiere_CodeFil(String codeFil);


}