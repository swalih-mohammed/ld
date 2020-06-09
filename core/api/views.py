from django_countries import countries
from django.contrib import humanize
from rest_framework.mixins import UpdateModelMixin
from django.db.models import Q
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import (
    ListAPIView, RetrieveAPIView, CreateAPIView,
    UpdateAPIView, DestroyAPIView, GenericAPIView
)

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from core.models import Item, OrderItem, Order

from .serializers import (
    ShopSerializer, ItemSerializer, OrderSerializer, ItemDetailSerializer, AddressSerializer,
    ShopProductSerializer, UserProfileSerializer, PlaceSerializer, AreaSerializer
)
from core.models import UserProfile, Place, Area, DeliveryStaff, Shop, Item, OrderItem, Order, Address, Coupon, Refund, UserProfile, Variation, ItemVariation


# import stripe

# stripe.api_key = settings.STRIPE_SECRET_KEY


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id, }, status=HTTP_200_OK)


class orderAddressView(RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class UserTypeView(APIView):
    def get(self, request, *args, **kwargs):
        profile = UserProfile.objects.get(user=request.user)
        if profile.is_shop_owner:
            print("is_shop_owner")
            return Response({'UserType': "ShopOwner"}, status=HTTP_200_OK)
        elif profile.is_delivery_staff:
            print("is_delivery_staff")
            return Response({'UserType': "DeliveryStaff"}, status=HTTP_200_OK)
        else:
            print("customer")
            return Response({'UserType': "Customer"}, status=HTTP_200_OK)


class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemSerializer
    queryset = Item.objects.all()


class PlaceListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PlaceSerializer
    queryset = Place.objects.all()


class PlaceShopListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ShopSerializer

    def get_queryset(self):
        return Shop.objects.filter(place_id=self.kwargs['place_id'])


class AreaListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = AreaSerializer

    def get_queryset(self):
        print(self.kwargs['name'])
        qs = Place.objects.get(name=self.kwargs['name'])
        return Area.objects.filter(place_id=qs.id)


class ShopListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ShopSerializer
    queryset = Shop.objects.all()


class ShopProductListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ShopProductSerializer
    # queryset = Item.objects.all()

    def get_queryset(self):
        return Item.objects.filter(shop_id=self.kwargs['shop_id'])


class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()


class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, slug=slug)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                order_item = OrderItem.objects.filter(
                    item=item,
                    user=request.user,
                    ordered=False
                )[0]
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order.items.remove(order_item)
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This item was not in your cart"}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = OrderItem.objects.all()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        shop = request.data.get('shop', None)
        id = request.data.get('id', None)
        variations = request.data.get('variations', [])
        item = get_object_or_404(Item, id=id)
        shop = get_object_or_404(Shop, id=shop)
        place_id = shop.place_id
        place = Place.objects.get(id=place_id)
        qs_user_address = Address.objects.filter(
            user=request.user)
        # shipping_address = qs_user_address[0]
        shipping_address = qs_user_address.first()

        if not shipping_address:
            return Response({"message": "Please add a delivery address from profile page"}, status=HTTP_400_BAD_REQUEST)
        else:
            # if len(shipping_address) < 1:
            #

            minimum_variation_count = Variation.objects.filter(
                item=item).count()
            if len(variations) < minimum_variation_count:
                return Response({"message": "Please specify the required variation types"}, status=HTTP_400_BAD_REQUEST)

            order_item_qs = OrderItem.objects.filter(
                item=item,
                user=request.user,
                # shop=shop,
                ordered=False
            )

            for v in variations:
                order_item_qs = order_item_qs.filter(
                    Q(item_variations__exact=v)
                )

            if order_item_qs.exists():

                order_item = order_item_qs.first()
                order_item.quantity += 1
                order_item.save()
            else:

                order_item = OrderItem.objects.create(
                    item=item,
                    shop=shop,
                    place=place,
                    # shipping_address=shipping_address,
                    user=request.user,
                    ordered=False
                )
                order_item.item_variations.add(*variations)
                order_item.save()
                # print(order_item.shop_id)

        order_qs = Order.objects.filter(user=request.user, ordered=False)

        if order_qs.exists():
            order = order_qs[0]

            myorder = OrderItem.objects.filter(
                user=self.request.user, ordered=False)
            order1 = myorder[0]
            cart_item_shop_id = order1.item.shop_id
            cart_item_shop = Shop.objects.get(id=cart_item_shop_id)

            if shop != cart_item_shop:
                # print(cart_item_shop)
                # print(shop)
                return Response({"message": "Unable to add this tiem to your bucket as your have an active order from a diffent shop. Please remove that item and try again"}, status=HTTP_400_BAD_REQUEST)

            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)

                return Response(status=HTTP_200_OK)

        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                user=request.user, shop=shop, shipping_address=shipping_address, place=place, ordered_date=ordered_date)
            order.items.add(order_item)

            return Response(status=HTTP_200_OK)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")
            # return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderConfirmView(APIView):
    def post(self, request, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        userprofile = UserProfile.objects.get(user=self.request.user)
        shipping_address_id = request.data.get('orderAddressID')

        order_items = order.items.all()
        shop_qs1 = order_items.first()
        shop_id = shop_qs1.shop_id
        place_id = shop_qs1.place_id
        shop = Shop.objects.get(id=shop_id)
        place = Place.objects.get(id=shop.place_id)
        order_status = "Not Accepted by Shop"
        shipping_address = Address.objects.get(id=shipping_address_id)

        order_items.update(ordered=True)
        for item in order_items:
            item.save()
        order.ordered = True
        order.save()

        return Response(status=HTTP_200_OK)


# class OrderStatusUpdateView(APIView):
class OrderStatusUpdateView(GenericAPIView, UpdateModelMixin):
    '''
    You just need to provide the field which is to be modified.
    '''
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class AddCouponView(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get('code', None)
        if code is None:
            return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)
        order = Order.objects.get(
            user=self.request.user, ordered=False)
        coupon = get_object_or_404(Coupon, code=code)
        order.coupon = coupon
        order.save()
        return Response(status=HTTP_200_OK)


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(countries, status=HTTP_200_OK)


class AddressListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer

    def get_queryset(self):
        addresses = Address.objects.filter(user=self.request.user)
        # for a in addresses:
        #     print(a)
        return addresses


class AddressCreateView(CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Address.objects.all()


class OrderDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Order.objects.all()


class DeliveryStaffOrders(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = OrderSerializer

    def get_queryset(self):
        staff = DeliveryStaff.objects.get(
            user=self.request.user)
        place = Place.objects.get(id=staff.place_id)
        return Order.objects.filter(place=place, ordered=True)


class OrderListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = OrderSerializer

    def get_queryset(self):
        profile = UserProfile.objects.get(user=self.request.user)
        if profile.is_shop_owner:
            # print("owner")
            shop = Shop.objects.get(owner=self.request.user)
            # print(self.request.user)
            return Order.objects.filter(shop=shop, ordered=True).order_by('-start_date')
        elif profile.is_delivery_staff:
            # print("Staff")
            staff = DeliveryStaff.objects.get(
                user=self.request.user)
            place = Place.objects.get(id=staff.place_id)
            return Order.objects.filter(place=place, ordered=True).order_by('-start_date')
        else:
            # print("customer")
            return Order.objects.filter(user=self.request.user, ordered=True).order_by('-start_date')


# class ShopOrders(ListAPIView):
#     permission_classes = (IsAuthenticated, )
#     serializer_class = OrderSerializer

#     def get_queryset(self):
#         shop = Shop.objects.get(owner=self.request.user)
#         print(self.request.user)
#         return Order.objects.filter(shop=shop, ordered=True)


# class OrderListView(ListAPIView):
#     permission_classes = (IsAuthenticated, )
#     serializer_class = OrderSerializer

#     def get_queryset(self):
#         return Order.objects.filter(user=self.request.user)
