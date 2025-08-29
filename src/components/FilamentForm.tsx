import { useState, useEffect } from 'react';
import { Filament, FilamentFormData, MATERIAL_TYPES, COMMON_BRANDS } from '@/types/filament';
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
    quantidade: 0
  });

  useEffect(() => {
    if (filament) {
      setFormData({
        marca: filament.marca,
        material: filament.material,
        cor: filament.cor,
        corRgb: filament.corRgb,
        quantidade: filament.quantidade
      });
    } else {
      setFormData({
        marca: '',
        material: '',
        cor: '',
        corRgb: '#808080',
        quantidade: 0
      });
    }
  }, [filament, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit(formData);
    onClose();
    
    toast({
      title: filament ? "Filamento atualizado" : "Filamento adicionado",
      description: `${formData.marca} ${formData.material} ${formData.cor} foi ${filament ? 'atualizado' : 'adicionado'} com sucesso.`,
      variant: "default"
    });
  };

  const handleChange = (field: keyof FilamentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {filament ? 'Editar Filamento' : 'Adicionar Filamento'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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