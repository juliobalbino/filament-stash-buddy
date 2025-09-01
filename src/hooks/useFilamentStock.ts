import { useState, useEffect } from 'react';
import { Filament, FilamentFormData } from '@/types/filament';
import { FilamentService } from '@/services/filament.service';
import { useToast } from '@/hooks/use-toast';

export function useFilamentStock() {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFilaments();
  }, []);

  const loadFilaments = async () => {
    try {
      const data = await FilamentService.getAll();
      setFilaments(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar filamentos",
        description: "Não foi possível carregar a lista de filamentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addFilament = async (formData: FilamentFormData) => {
    try {
      const newFilament = await FilamentService.create(formData);
      setFilaments(prev => [...prev, newFilament]);
      toast({
        title: "Filamento adicionado",
        description: `${formData.marca} ${formData.material} ${formData.cor} foi adicionado com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar filamento",
        description: "Não foi possível adicionar o filamento.",
        variant: "destructive"
      });
    }
  };

  const updateFilament = async (id: string, formData: FilamentFormData) => {
    try {
      const updated = await FilamentService.update(id, formData);
      setFilaments(prev => prev.map(f => f.id === id ? updated : f));
      toast({
        title: "Filamento atualizado",
        description: `${formData.marca} ${formData.material} ${formData.cor} foi atualizado com sucesso.`
      });
      return updated;
    } catch (error) {
      toast({
        title: "Erro ao atualizar filamento",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o filamento.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteFilament = async (id: string) => {
    try {
      await FilamentService.delete(id);
      setFilaments(prev => prev.filter(f => f.id !== id));
      toast({
        title: "Filamento excluído",
        description: "O filamento foi excluído com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir filamento",
        description: "Não foi possível excluir o filamento.",
        variant: "destructive"
      });
    }
  };

  const updateQuantity = async (id: string, quantidade: number) => {
    try {
      if (quantidade < 0) {
        throw new Error('A quantidade não pode ser negativa');
      }
      const updated = await FilamentService.updateQuantity(id, quantidade);
      setFilaments(prev => prev.map(f => f.id === id ? updated : f));
      toast({
        title: "Quantidade atualizada",
        description: "A quantidade do filamento foi atualizada com sucesso."
      });
      return updated;
    } catch (error) {
      toast({
        title: "Erro ao atualizar quantidade",
        description: error instanceof Error ? error.message : "Não foi possível atualizar a quantidade do filamento.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const exportToCSV = () => {
    const headers = ['Marca', 'Material', 'Cor', 'Quantidade (Rolos)', 'Peso Carretel (g)', 'Peso Filamento (g)', 'Peso Total do Rolo (g)'];
    const csvContent = [
      headers.join(','),
      ...filaments.map(f => 
        `${f.marca},${f.material},"${f.cor}",${f.quantidade},${f.pesoCarretel || ''},${f.pesoFilamento || ''},${f.pesoRolo || ''}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estoque-filamentos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').slice(1); // Skip header
      
      try {
        for (const line of lines) {
          if (!line.trim()) continue;
          
          const [marca, material, cor, quantidade, pesoCarretel, pesoFilamento, pesoRolo] = line.split(',');
          const formData: FilamentFormData = {
            marca: marca?.trim() || '',
            material: material?.trim() || '',
            cor: cor?.trim().replace(/"/g, '') || '',
            corRgb: '#808080', // Cor padrão para imports
            quantidade: parseInt(quantidade?.trim() || '0'),
            pesoCarretel: pesoCarretel ? parseInt(pesoCarretel.trim()) : undefined,
            pesoFilamento: pesoFilamento ? parseInt(pesoFilamento.trim()) : undefined,
            pesoRolo: pesoRolo ? parseInt(pesoRolo.trim()) : undefined
          };
          
          if (formData.marca && formData.material && formData.cor) {
            await addFilament(formData);
          }
        }
        
        toast({
          title: "Importação concluída",
          description: "Os filamentos foram importados com sucesso."
        });
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Ocorreu um erro ao importar os filamentos.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return {
    filaments,
    loading,
    addFilament,
    updateFilament,
    deleteFilament,
    updateQuantity,
    exportToCSV,
    importFromCSV,
    stats: {
      total: filaments.length,
      lowStock: filaments.filter(f => f.quantidade <= 1).length,
      outOfStock: filaments.filter(f => f.quantidade === 0).length,
      totalRolls: filaments.reduce((sum, f) => sum + f.quantidade, 0)
    }
  };
}