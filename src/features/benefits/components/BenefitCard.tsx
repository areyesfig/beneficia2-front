import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import {
  Home,
  Gift,
  Briefcase,
  CircleDollarSign,
  ChevronRight,
  GraduationCap,
  Heart,
  Baby,
  User,
  Rocket,
  type LucideIcon,
} from 'lucide-react-native';
import { formatCurrency } from '@/utils/format-currency';
import { cardStyle, buttonStyle } from '@/styles/screenStyles';
import { theme } from '@/theme/theme';
import { VStack, HStack } from '@/theme/layout';
import { AnimatedPressableScale } from '@/components/AnimatedPressable';

export type BenefitStatus = 'ELIGIBLE' | 'MISSING_DATA';

export type ApplicationActionStatus = 'APPLIED' | 'DISMISSED';

export interface BenefitCardProps {
  id?: string;
  title: string;
  description?: string | null;
  amount?: number | null;
  deadline: string;
  status: BenefitStatus;
  category?: string;
  urlApply?: string | null;
  /** Labels para "Te falta: X, Y" (1-2 líneas) */
  missingLabels?: string[];
  /** Indica si el beneficio requiere postulación activa (true) o es automático (false) */
  requiresApplication?: boolean;
  onPostular?: () => void;
  onAction?: (benefitId: string, status: ApplicationActionStatus) => void;
  onCompletarPerfil?: () => void;
}

const CATEGORY_ICON: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  VIVIENDA: { Icon: Home, bg: theme.colors.primaryTint, color: theme.colors.primary },
  BONOS_ESTATALES: { Icon: Gift, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  BONOS_Y_PENSIONES: { Icon: Gift, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  CAPACITACION_Y_EMPLEO: { Icon: Briefcase, bg: theme.colors.primaryTint, color: theme.colors.primary },
  SALUD_Y_CUIDADOS: { Icon: Heart, bg: theme.colors.primaryTint, color: theme.colors.primary },
  SALUD: { Icon: Heart, bg: theme.colors.primaryTint, color: theme.colors.primary },
  NINEZ_Y_ADOLESCENCIA: { Icon: Baby, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  JUVENTUD_Y_ESTUDIOS: { Icon: GraduationCap, bg: theme.colors.primaryTint, color: theme.colors.primary },
  EDUCACION: { Icon: GraduationCap, bg: theme.colors.primaryTint, color: theme.colors.primary },
  ADULTO_MAYOR: { Icon: User, bg: theme.colors.primaryTint, color: theme.colors.primaryDark },
  EMPRENDIMIENTO: { Icon: Rocket, bg: theme.colors.primaryTint, color: theme.colors.primary },
  default: { Icon: CircleDollarSign, bg: theme.colors.border, color: theme.colors.textSecondary },
};

function getCategoryStyle(category?: string) {
  if (!category) return CATEGORY_ICON.default;
  const key = category.toUpperCase().replace(/\s+/g, '_');
  return CATEGORY_ICON[key] ?? CATEGORY_ICON.default;
}

const MAX_DESCRIPTION_PARAM_LENGTH = 800;

export function BenefitCard({
  id,
  title,
  description,
  amount,
  deadline,
  status,
  category,
  urlApply,
  missingLabels,
  requiresApplication = true,
  onPostular,
  onAction,
  onCompletarPerfil,
}: BenefitCardProps) {
  const isEligible = status === 'ELIGIBLE';
  const hasMissing = (missingLabels?.length ?? 0) > 0;
  const { Icon, bg, color } = getCategoryStyle(category);
  const teFaltaLine = hasMissing
    ? `Te falta: ${missingLabels!.slice(0, 3).join(', ')}`
    : null;
  const showInfoButton = !requiresApplication;

  const cardContent = (
    <>
      <HStack spacing={theme.spacing.sm} style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
        <View
          style={[
            { width: 48, height: 48, borderRadius: theme.borderRadius.full, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
            cardStyle.wrapper,
          ]}
        >
          <Icon size={24} color={color} strokeWidth={2} />
        </View>
        <View
          style={[
            {
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.full,
              backgroundColor: isEligible ? theme.colors.successTint : theme.colors.warningTint,
            },
            cardStyle.wrapper,
          ]}
        >
          <Text
            style={[
              theme.typography.caption,
              { fontWeight: '600', color: isEligible ? theme.colors.successText : theme.colors.warningText },
            ]}
          >
            {isEligible ? 'Elegible' : 'Falta info'}
          </Text>
        </View>
      </HStack>

      <Text style={[theme.typography.h3, { color: theme.colors.text, lineHeight: 28 }]} numberOfLines={2}>
        {title}
      </Text>
      {teFaltaLine ? (
        <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]} numberOfLines={2}>
          {teFaltaLine}
        </Text>
      ) : null}
      <Text style={[theme.typography.h2, { color: theme.colors.primaryDark, marginTop: theme.spacing.md }]}>
        {formatCurrency(amount)}
      </Text>
      <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
        Vence: {deadline}
      </Text>

      {!isEligible && (
        <VStack spacing={theme.spacing.xs} style={{ marginTop: theme.spacing.lg }}>
          <View
            style={[
              { height: 6, width: '100%', overflow: 'hidden', borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.border },
              cardStyle.wrapper,
            ]}
          >
            <View
              style={[{ height: '100%', borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.warning }, { width: '50%' }]}
            />
          </View>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>1 de 2 requisitos</Text>
        </VStack>
      )}

      {showInfoButton ? (
        <View style={{ marginTop: theme.spacing.lg }}>
          <Pressable
            style={[
              {
                minHeight: 48,
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.lg,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.primary,
                flexDirection: 'row',
                gap: theme.spacing.xs,
              },
              buttonStyle.rounded,
              buttonStyle.shadowPrimary,
            ]}
          >
            <Text style={[theme.typography.label, { fontWeight: '700', color: '#fff' }]}>
              Ver más información
            </Text>
            <ChevronRight size={20} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: theme.spacing.lg, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <ChevronRight size={22} color={theme.colors.textSecondary} strokeWidth={2} />
        </View>
      )}
    </>
  );

  const cardWrapperStyle = [
    { overflow: 'hidden', backgroundColor: theme.colors.surface, padding: theme.spacing.xl },
    cardStyle.wrapper,
    cardStyle.shadow,
  ];

  if (id) {
    const descParam = description?.trim();
    const query = new URLSearchParams({
      title: title ?? '',
      status,
      deadline: deadline ?? '',
      amount: amount != null ? String(amount) : '',
      ...(descParam != null && descParam !== '' ? { description: descParam.length > MAX_DESCRIPTION_PARAM_LENGTH ? descParam.slice(0, MAX_DESCRIPTION_PARAM_LENGTH) + '…' : descParam } : {}),
    });
    const href = `/benefit/${id}?${query.toString()}`;
    return (
      <Link href={href} asChild>
        <AnimatedPressableScale style={cardWrapperStyle}>
          {cardContent}
        </AnimatedPressableScale>
      </Link>
    );
  }

  return (
    <AnimatedPressableScale style={cardWrapperStyle} onPress={onPostular}>
      {cardContent}
    </AnimatedPressableScale>
  );
}
