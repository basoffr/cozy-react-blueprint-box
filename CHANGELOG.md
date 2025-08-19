# Changelog

## 2025-05-27: Nieuwe Template Aanmaken Functionaliteits

### Context
De "Nieuwe template aanmaken" knop op de Templates pagina leidde nergens naartoe. De functionaliteit is toegevoegd om gebruikers naar de Sequence Editor te leiden voor het aanmaken van een nieuwe template.

### Wijzigingen

1. **TemplatesContent.tsx**
   - Toegevoegd: `handleCreateNewTemplate` functie die navigeert naar `/templates/new/sequence`
   - Aangepast: "Nieuwe template aanmaken" knop om deze functie aan te roepen bij klikken

   ```typescript
   const handleCreateNewTemplate = () => {
     navigate('/templates/new/sequence');
   };
   ```

   ```jsx
   <Button 
     className="bg-blue-600 hover:bg-blue-700 text-white"
     onClick={handleCreateNewTemplate}
   >
     <Plus className="h-4 w-4 mr-2" />
     Nieuwe template aanmaken
   </Button>
   ```

2. **App.tsx**
   - Toegevoegd: Nieuwe route `/templates/new/sequence` die naar de Sequence Editor component leidt

   ```jsx
   <Route path="/templates/new/sequence" element={<SequenceEditor />} />
   ```

3. **SequenceEditor.tsx**
   - Toegevoegd: Detectie of het een nieuwe template is (via `id === 'new'`)
   - Toegevoegd: Invoerveld voor de naam van de nieuwe template
   - Aangepast: UI titel om "Create New Sequence" te tonen voor nieuwe templates
   - Uitgebreid: Save functionaliteit om eerst een nieuwe template aan te maken en dan de sequence op te slaan
   - Aangepast: Initialisatie van stappen voor nieuwe templates

   ```typescript
   const [isNewTemplate, setIsNewTemplate] = useState(id === 'new');
   const [templateName, setTemplateName] = useState('');
   ```

   ```jsx
   <h1 className="text-3xl font-bold text-[#5C4DAF]">
     {isNewTemplate ? 'Create New Sequence' : 'Sequence Editor'}
   </h1>
   {isNewTemplate && (
     <div className="mt-2">
       <input
         type="text"
         value={templateName}
         onChange={(e) => setTemplateName(e.target.value)}
         placeholder="Enter template name"
         className="px-3 py-2 border rounded-md w-64"
         required
       />
     </div>
   )}
   ```

### Toekomstige verbeteringen
- Toevoegen van validatie voor de template naam voordat de gebruiker kan opslaan
- Verbeteren van de gebruikerservaring door feedback te geven tijdens het aanmaken van een nieuwe template
- Toevoegen van een annuleerknop om terug te keren naar de Templates pagina
