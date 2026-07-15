import React from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import Type from '../components/Type';
import Avatar, { AvatarStack } from '../components/Avatar';
import Icon from '../components/Icon';
import Tap from '../components/Tap';
import Appear from '../components/Appear';
import { colors, shadow, brandShadow } from '../theme';
import { success } from '../lib/haptics';
import { useApp, SCREENS } from '../context/AppContext';

function NotifBell({ onPress }) {
  return (
    <Tap
      onPress={onPress}
      haptic="light"
      accessibilityLabel="Alerts, 1 unread"
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="notifications-outline" size={22} color={colors.ink} />
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: 11,
          width: 9,
          height: 9,
          borderRadius: 5,
          backgroundColor: colors.red,
          borderWidth: 2,
          borderColor: colors.surface,
        }}
      />
    </Tap>
  );
}

// Small "Ifrane ──→ Dest" route strip with pin dots.
function RouteStrip({ from, to, when }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.positive }} />
      <Type w={700} size={13} color={colors.ink}>
        {from}
      </Type>
      <View style={{ flex: 1, height: 1.5, backgroundColor: colors.hair, borderRadius: 1 }} />
      <Type w={500} size={11} color={colors.muted}>
        {when}
      </Type>
      <View style={{ flex: 1, height: 1.5, backgroundColor: colors.hair, borderRadius: 1 }} />
      <Type w={700} size={13} color={colors.ink}>
        {to}
      </Type>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ink }} />
    </View>
  );
}

function CarRow({ car, index, onPress }) {
  return (
    <Appear index={index}>
      <Tap
        onPress={onPress}
        accessibilityLabel={`${car.name}, ${car.when}, ${car.price}, ${car.seats}`}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 14,
            borderRadius: 18,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
          },
          shadow(1),
        ]}
      >
        <Avatar initial={car.init} bg={car.bg} size={44} />
        <View style={{ flex: 1, gap: 3 }}>
          <Type w={700} size={14} color={colors.ink}>
            {car.name}
          </Type>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Icon name="time-outline" size={13} color={colors.muted} />
            <Type w={500} size={12} color={colors.muted}>
              {car.when}
            </Type>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Type w={800} size={14} color={colors.ink}>
            {car.price}
          </Type>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: colors.positiveTint,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
            }}
          >
            <Icon name="person" size={10} color={colors.positiveDark} />
            <Type w={700} size={10.5} color={colors.positiveDark}>
              {car.seats}
            </Type>
          </View>
        </View>
      </Tap>
    </Appear>
  );
}

export default function HomeScreen() {
  const { P, navigate } = useApp();

  const takeSeat = () => {
    success();
    navigate(SCREENS.RIDE);
  };

  return (
    <Screen scroll>
      {/* Header */}
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Type w={500} size={13} color={colors.muted}>
            Salam,
          </Type>
          <Type w={800} size={22} color={colors.ink} style={{ letterSpacing: -0.5 }}>
            {P.name}
          </Type>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NotifBell onPress={() => navigate(SCREENS.NOTIFS)} />
          <Tap
            onPress={() => navigate(SCREENS.YOU)}
            haptic="light"
            accessibilityLabel={`${P.name}, your profile`}
          >
            <Avatar initial={P.initial} bg={P.avBg} size={44} style={shadow(1)} />
          </Tap>
        </View>
      </View>

      {/* AI pick — your usual car */}
      <Appear index={0}>
        <View
          style={[
            {
              marginTop: 20,
              borderRadius: 22,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 18,
              gap: 16,
              overflow: 'hidden',
            },
            shadow(2),
          ]}
        >
          {/* recommended banner */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: colors.primaryTint,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
              }}
            >
              <Icon name="sparkles" size={13} color={colors.primary} />
              <Type w={700} size={11} color={colors.primary} style={{ letterSpacing: 0.2 }}>
                Your usual car
              </Type>
            </View>
            <Tap
              onPress={() => navigate(SCREENS.YOU)}
              haptic="light"
              hitSlop={12}
              accessibilityLabel="Why this car? See your profile"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
            >
              <Icon name="information-circle-outline" size={15} color={colors.muted} />
              <Type w={600} size={12} color={colors.muted}>
                Why?
              </Type>
            </Tap>
          </View>

          {/* driver */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar initial={P.driverInitial} bg={P.drvBg} size={48} />
            <View style={{ flex: 1, gap: 3 }}>
              <Type w={700} size={16} color={colors.ink}>
                {P.driverName}
              </Type>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="star" size={13} color={colors.star} />
                <Type w={600} size={12.5} color={colors.slate}>
                  {P.driverRating} · Driver
                </Type>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Type w={800} size={18} color={colors.ink}>
                {P.fareShort}
              </Type>
              <Type w={500} size={11} color={colors.muted}>
                per seat
              </Type>
            </View>
          </View>

          <RouteStrip from="Ifrane" to={P.destNice} when={P.departNice} />

          <View style={{ height: 1, backgroundColor: colors.hair }} />

          {/* crew + seats */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <AvatarStack crew={P.crew} ringColor={colors.card} addSeat />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icon name="person" size={14} color={colors.positiveDark} />
              <Type w={700} size={12.5} color={colors.positiveDark}>
                {P.seatsLine}
              </Type>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tap
              onPress={takeSeat}
              haptic="medium"
              accessibilityLabel={`Book my seat for ${P.fareShort}`}
              style={[
                {
                  flex: 1,
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 7,
                },
                brandShadow(),
              ]}
            >
              <Type w={700} size={15} color={colors.white}>
                Book my seat
              </Type>
              <Icon name="arrow-forward" size={17} color={colors.white} />
            </Tap>
            <Tap
              onPress={() => {}}
              accessibilityLabel="Skip this car"
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                backgroundColor: colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="close" size={22} color={colors.muted} />
            </Tap>
          </View>
        </View>
      </Appear>

      {/* More cars */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 26,
          marginBottom: 12,
        }}
      >
        <Type w={800} size={16} color={colors.ink} style={{ letterSpacing: -0.3 }}>
          More cars to {P.destNice}
        </Type>
        <Type w={600} size={12.5} color={colors.primary}>
          See all
        </Type>
      </View>
      <View style={{ gap: 10 }}>
        {P.moreCars.map((m, i) => (
          <CarRow key={i} car={m} index={i + 1} onPress={takeSeat} />
        ))}
      </View>
    </Screen>
  );
}
