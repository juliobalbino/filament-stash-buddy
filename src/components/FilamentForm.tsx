import { useState, useEffect } from 'react';
import { Filament, FilamentFormData, MATERIAL_TYPES, COMMON_BRANDS, CARRETEL_WEIGHTS } from '@/types/filament';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface FilamentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FilamentFormData) => void;
  filament?: Filament | null;
}

export function FilamentForm({ isOpen, onClose, onSubmit, filament }: FilamentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FilamentFormData>({
    marca: '',
    material: '',
    cor: '',
    corRgb: '#808080',
    quantidade: 0,
    pesoCarretel: undefined,
    pesoFilamento: undefined,
    pesoRolo: undefined
  });

  useEffect(() => {
    if (filament) {
      setFormData({
        marca: filament.marca,
        material: filament.material,
        cor: filament.cor,
        corRgb: filament.corRgb,
        quantidade: filament.quantidade,
        pesoCarretel: filament.pesoCarretel,
        pesoFilamento: filament.pesoFilamento,
        pesoRolo: filament.pesoRolo
      });
    } else {
      setFormData({
        marca: '',
        material: '',
        cor: '',
        corRgb: '#808080',
        quantidade: 0,
        pesoCarretel: undefined,
        pesoFilamento: undefined,
        pesoRolo: undefined
      });
    }
  }, [filament, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.marca || !formData.material || !formData.cor || !formData.corRgb) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (formData.quantidade < 0) {
      toast({
        title: "Quantidade inválida",
        description: "A quantidade não pode ser negativa.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Erro já tratado no hook useFilamentStock
      return;
    }
  };

  const handleChange = (field: keyof FilamentFormData, value: string | number) => {
    if (field === 'marca' && typeof value === 'string') {
      // Preencher automaticamente o peso do carretel com base na marca selecionada
      const pesoCarretel = CARRETEL_WEIGHTS[value];
      
      setFormData(prev => ({
        ...prev,
        [field]: value,
        pesoCarretel: pesoCarretel || prev.pesoCarretel
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {filament ? 'Editar Filamento' : 'Adicionar Filamento'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] px-2 [&::-webkit-scrollbar]:hidden">
          <div className="space-y-2">
            <Label htmlFor="marca">Marca</Label>
            <Select
              value={formData.marca}
              onValueChange={(value) => handleChange('marca', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma marca" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_BRANDS.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
                <SelectItem value="custom">Outra marca...</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.marca === 'custom' && (
              <Input
                placeholder="Digite a marca"
                value={formData.marca === 'custom' ? '' : formData.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Select
              value={formData.material}
              onValueChange={(value) => handleChange('material', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o material" />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_TYPES.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor">Nome da Cor</Label>
            <Input
              id="cor"
              value={formData.cor}
              onChange={(e) => handleChange('cor', e.target.value)}
              placeholder="Ex: Preto, Branco, Azul..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corRgb">Cor RGB</Label>
            <div className="flex items-center gap-3">
              <input
                id="corRgb"
                type="color"
                value={formData.corRgb}
                onChange={(e) => handleChange('corRgb', e.target.value)}
                className="w-12 h-10 border border-input rounded-md cursor-pointer bg-background"
              />
              <Input
                value={formData.corRgb}
                onChange={(e) => handleChange('corRgb', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade (Rolos)</Label>
            <Input
              id="quantidade"
              type="number"
              min="0"
              value={formData.quantidade}
              onChange={(e) => handleChange('quantidade', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesoCarretel">Peso do Carretel (g)</Label>
            <Input
              id="pesoCarretel"
              type="number"
              min="0"
              value={formData.pesoCarretel || ''}
              onChange={(e) => handleChange('pesoCarretel', parseInt(e.target.value) || undefined)}
              placeholder="Ex: 200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesoFilamento">Peso do Filamento (g)</Label>
            <Input
              id="pesoFilamento"
              type="number"
              min="0"
              value={formData.pesoFilamento || ''}
              onChange={(e) => handleChange('pesoFilamento', parseInt(e.target.value) || undefined)}
              placeholder="Ex: 1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesoRolo">Peso Total do Rolo (g)</Label>
            <Input
              id="pesoRolo"
              type="number"
              min="0"
              value={formData.pesoRolo || ''}
              onChange={(e) => handleChange('pesoRolo', parseInt(e.target.value) || undefined)}
              placeholder="Ex: 1200"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {filament ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}