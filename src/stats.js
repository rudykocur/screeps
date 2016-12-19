module.exports = (function() {
    return {
        registerIncome(roomName, type, role, amount) {
            var stats = Memory.stats = Memory.stats || {};

            stats.expenses = stats.expenses || [];

            stats.expenses.push({
                room: roomName,
                income: amount,
                type: type,
                tick: Game.time,
                role: role,
                eventDate: new Date().toISOString(),
            });
        },

        registerExpense(roomName, type, role, amount) {
            var stats = Memory.stats = Memory.stats || {};

            stats.expenses = stats.expenses || [];

            stats.expenses.push({
                room: roomName,
                expense: amount,
                type: type,
                tick: Game.time,
                role: role,
                eventDate: new Date().toISOString(),
            });
        },

        registerCpuTick(timer) {

            var data = {
                total: timer.end,
                begin: timer.begin,
                init: timer.init - timer.begin,
                combatActions: timer.combatActions - timer.init,
                rooms: timer.rooms - timer.combatActions,
                spawn: timer.spawn - timer.rooms,
                creeps: timer.creeps - timer.rooms,
                towers: timer.towers - timer.creeps,
                gangs: timer.gangs - timer.towers,
                tick: Game.time,
                eventDate: new Date().toISOString(),
            };

            var stats = Memory.stats = Memory.stats || {};
            stats.cpu = stats.cpu || [];

            stats.cpu.push(data);
        },

        manageRegisters() {
            var stats = Memory.stats = Memory.stats || {};

            if(stats.expenses && stats.expenses.length > 1500) {
                var result = stats.expenses.splice(0, stats.expenses.length - 1300);
                console.log('trimmed', result.length, 'expense events');
            }

            if(stats.cpu && stats.cpu.length > 1500) {
                stats.cpu.splice(0, stats.expenses.length - 1300);
            }
        }
    }
})();