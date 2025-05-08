from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator, MinLengthValidator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import datetime

class CustomUser(models.Model):
    nom = models.CharField(
        _('nom'),
        max_length=100,
        validators=[MinLengthValidator(3)],
        help_text=_('Le nom doit contenir au moins 3 caractères')
    )

    telephone_validator = RegexValidator(
        regex=r'^[234]\d{7}$',
        message=_('Entrez un numéro de téléphone mauritanien valide')
    )
    telephone = models.CharField(
        _('téléphone'),
        max_length=8,
        validators=[telephone_validator],
        blank=False,
        null=False,
        help_text=_('Format: 8 chiffres commençant par 2, 3 ou 4')
    )

    date_naissance = models.DateField(
        _('date de naissance'),
        null=False,
        blank=False,
        help_text=_('Format requis: aaaa-mm-jj (exemple: 1990-05-15)')
    )

    def clean(self):
        super().clean()
        if self.date_naissance:
            if self.date_naissance > timezone.now().date():
                raise ValidationError({
                    'date_naissance': _('La date de naissance ne peut pas être dans le futur.')
                })

    def __str__(self):
        return self.nom
