from django.contrib import admin

from .models import (
    Place, Shop, Category, Item, OrderItem, Order, Coupon, Refund,
    Address, UserProfile, Variation, ItemVariation, DeliveryStaff, Area
)


def make_refund_accepted(modeladmin, request, queryset):
    queryset.update(refund_requested=False, refund_granted=True)


make_refund_accepted.short_description = 'Update orders to refund granted'


class OrderAdmin(admin.ModelAdmin):
    list_display = ['user',
                    'ordered',
                    'order_status',
                    'mode_of_payment',
                    ]
    list_display_links = [
        'user',
        'order_status',
        'mode_of_payment'
    ]
    list_filter = ['mode_of_payment',
                   ]
    search_fields = [
        'user__username',
        'ref_code'
    ]
    actions = [make_refund_accepted]


class AddressAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'default'
    ]
    list_filter = ['default']
    search_fields = ['user', 'place']


class ItemVariationAdmin(admin.ModelAdmin):
    list_display = ['variation',
                    'value',
                    'attachment']
    list_filter = ['variation', 'variation__item']
    search_fields = ['value']


class ItemVariationInLineAdmin(admin.TabularInline):
    model = ItemVariation
    extra = 1


class VariationAdmin(admin.ModelAdmin):
    list_display = ['item',
                    'name']
    list_filter = ['item']
    search_fields = ['name']
    inlines = [ItemVariationInLineAdmin]


class PlaceAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    list_filter = ['name']
    search_fields = ['name']


class AreaAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    list_filter = ['name']
    search_fields = ['place']


class DeliveryStaffAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    list_filter = ['name']
    search_fields = ['name']


class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    list_filter = ['name']
    search_fields = ['name']


class ShopAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    list_filter = ['name']
    search_fields = ['name']


admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(Item)
admin.site.register(OrderItem)
admin.site.register(Order, OrderAdmin)
# admin.site.register(Payment)
admin.site.register(Coupon)
admin.site.register(Refund)
admin.site.register(Address, AddressAdmin)
admin.site.register(UserProfile)
admin.site.register(Place)
admin.site.register(Area)
admin.site.register(Shop)
admin.site.register(Category)
admin.site.register(DeliveryStaff)
