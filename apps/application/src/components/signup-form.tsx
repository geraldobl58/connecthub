import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback } from "react";

import {
  TextField,
  Button,
  Alert,
  Box,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { z } from "zod";
import { useAuthContext } from "../context/authContext";
import type { SignupRequest } from "../types/auth";
import { mapApiToFormError } from "../lib/formErrors";
import { authService } from "../http/auth";

// Signup schema for company registration with plan selection
const signupSchema = z.object({
  companyName: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  domain: z
    .string()
    .min(2, "Domínio deve ter pelo menos 2 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Domínio deve conter apenas letras minúsculas, números e hífens"
    ),
  contactName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  contactEmail: z.string().email("Email inválido"),
  plan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"], {
    message: "Selecione um plano válido",
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

// Plans data
const plans = [
  {
    value: "STARTER" as const,
    name: "Starter",
    price: 149.99,
    description: "Plano básico para pequenas empresas",
  },
  {
    value: "PROFESSIONAL" as const,
    name: "Professional",
    price: 299.99,
    description: "Plano profissional com API",
  },
  {
    value: "ENTERPRISE" as const,
    name: "Enterprise",
    price: 599.99,
    description: "Plano enterprise com recursos ilimitados",
  },
];

export function SignupForm() {
  const { signup } = useAuthContext();
  const [domainStatus, setDomainStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({
    checking: false,
    available: null,
    message: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: "",
      domain: "",
      contactName: "",
      contactEmail: "",
      plan: "PROFESSIONAL",
    },
  });

  // Auto-generate domain from company name
  const generateDomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Watch domain changes to check availability
  const domainValue = watch("domain");
  const companyNameValue = watch("companyName");

  // Auto-generate domain from company name (only when domain is empty)
  useEffect(() => {
    if (companyNameValue && companyNameValue.length >= 2 && !domainValue) {
      const generatedDomain = generateDomain(companyNameValue);
      setValue("domain", generatedDomain);
    }
  }, [companyNameValue, domainValue, setValue]);

  // Debounced domain availability check
  const checkDomainAvailabilityDebounced = useCallback(
    async (domain: string) => {
      if (!domain || domain.length < 2) {
        setDomainStatus({ checking: false, available: null, message: "" });
        return;
      }

      setDomainStatus({ checking: true, available: null, message: "" });

      try {
        // Try to check with backend first
        const result = await authService.checkDomainAvailability(domain);
        setDomainStatus({
          checking: false,
          available: result.available,
          message: result.available
            ? "Domínio disponível"
            : "Este domínio já está em uso",
        });
      } catch {
        // Fallback: simulate domain availability check
        // This is temporary until backend endpoint is ready
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulate API delay

        // Simple heuristic: very common names are likely taken
        const commonDomains = [
          "teste",
          "test",
          "admin",
          "api",
          "www",
          "mail",
          "email",
          "app",
          "web",
          "site",
          "blog",
          "shop",
          "store",
          "empresa",
          "company",
          "corp",
          "tech",
          "solutions",
          "consulting",
          "demo",
          "example",
          "sample",
          "default",
          "main",
          "home",
        ];

        const normalizedDomain = domain.toLowerCase().trim();
        const isCommon = commonDomains.some(
          (common) =>
            normalizedDomain.includes(common) || normalizedDomain === common
        );

        // Additional checks: very short domains or numeric-only are likely taken
        const isTooShort = normalizedDomain.length < 3;
        const isNumericOnly = /^\d+$/.test(normalizedDomain);

        const isAvailable = !isCommon && !isTooShort && !isNumericOnly;

        setDomainStatus({
          checking: false,
          available: isAvailable,
          message: isAvailable
            ? "Domínio provavelmente disponível"
            : "Este domínio pode já estar em uso",
        });
      }
    },
    []
  );

  // Effect to check domain availability with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (domainValue) {
        checkDomainAvailabilityDebounced(domainValue);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [domainValue, checkDomainAvailabilityDebounced]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Prepare signup data with URLs for Stripe redirect
      const baseUrl = window.location.origin;
      const signupData: SignupRequest = {
        companyName: data.companyName,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        domain: data.domain,
        plan: data.plan,
        successUrl: `${baseUrl}/auth/success`,
        cancelUrl: `${baseUrl}/auth/register`,
      };

      const response = await signup(signupData);

      // Check if it's a paid plan that requires Stripe checkout
      if (response.checkoutUrl) {
        // Redirect to Stripe checkout for paid plans
        window.location.href = response.checkoutUrl;
      } else if (response.success && response.tenant) {
        // For free plans or completed signups, redirect to success page
        window.location.href = `${baseUrl}/auth/success`;
      } else {
        setError("root", {
          message: "Erro ao processar cadastro. Tente novamente.",
        });
      }
    } catch (error: unknown) {
      mapApiToFormError(setError, error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Para planos pagos, você será redirecionado para o pagamento no Stripe.
        Após a confirmação, receberá um email com suas credenciais de acesso.
        Planos gratuitos são ativados imediatamente.
      </Alert>

      {/* Company Information */}
      <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
        Informações da Empresa
      </Typography>

      <Controller
        name="companyName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Nome da Empresa"
            type="text"
            autoComplete="organization"
            autoFocus
            error={!!errors.companyName}
            helperText={errors.companyName?.message}
          />
        )}
      />

      <Controller
        name="domain"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Domínio da Empresa (usado na URL)"
            type="text"
            error={!!errors.domain || domainStatus.available === false}
            helperText={
              errors.domain?.message ||
              (domainStatus.checking
                ? "Verificando disponibilidade..."
                : domainStatus.message) ||
              "Ex: minha-empresa"
            }
            InputProps={{
              endAdornment: domainStatus.checking ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : domainStatus.available === true ? (
                <InputAdornment position="end">
                  <CheckCircle color="success" />
                </InputAdornment>
              ) : domainStatus.available === false ? (
                <InputAdornment position="end">
                  <Cancel color="error" />
                </InputAdornment>
              ) : null,
            }}
          />
        )}
      />

      <Divider sx={{ my: 3 }} />

      {/* Plan Selection */}
      <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
        Selecione um Plano
      </Typography>

      <Controller
        name="plan"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.plan}>
            <InputLabel>Plano</InputLabel>
            <Select {...field} label="Plano">
              {plans.map((plan) => (
                <MenuItem key={plan.value} value={plan.value}>
                  <Box>
                    <Typography variant="body1">
                      {plan.name} - R$ {plan.price.toFixed(2)}/mês
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {plan.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.plan && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.plan.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Divider sx={{ my: 3 }} />

      {/* User Information */}
      <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
        Suas Informações
      </Typography>

      <Controller
        name="contactName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Seu Nome"
            type="text"
            autoComplete="name"
            error={!!errors.contactName}
            helperText={errors.contactName?.message}
          />
        )}
      />

      <Controller
        name="contactEmail"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            error={!!errors.contactEmail}
            helperText={errors.contactEmail?.message}
          />
        )}
      />

      {errors.root && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.root?.message || "Erro ao criar conta. Tente novamente."}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
        size="large"
      >
        {isSubmitting ? "Processando..." : "Criar Conta e Pagar"}
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <MuiLink component={Link} to="/auth/login" variant="body2">
          Já tem uma conta? Entre
        </MuiLink>
      </Box>
    </Box>
  );
}
